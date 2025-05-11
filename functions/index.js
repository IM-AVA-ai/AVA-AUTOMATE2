// csv-parser data for cloud functions

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { DataConnect } = require('@firebase/data-connect'); // Assuming you're using the Data Connect SDK
const csv = require('csv-parser');
const { Readable } = require('stream');

admin.initializeApp(); // Initialize Firebase Admin SDK

exports.importLeadsFromCSV = functions.https.onCall(async (data, context) => {
  // Ensure the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  const userId = context.auth.uid; // Get the authenticated user's ID

  // Assuming the CSV data is sent as a string in the 'data' object
  const csvData = data.csvData;
  if (!csvData) {
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with CSV data.');
  }

  // Initialize Data Connect (adjust configuration as needed)
  const dataConnect = new DataConnect({ projectId: process.env.GCLOUD_PROJECT });

  const successfulImports = [];
  const failedImports = [];

  // --- CSV Parsing Logic using csv-parser ---
  const results = [];
  const stream = Readable.from([csvData]); // Create a readable stream from the CSV string

  await new Promise((resolve, reject) => {
    stream
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve();
      })
      .on('error', (error) => {
        console.error('Error parsing CSV:', error);
        reject(new functions.https.HttpsError('internal', 'Error parsing CSV data.'));
      });
  });

  const parsedLeads = results;

  // --- Data Validation and Database Insertion ---
  for (const leadData of parsedLeads) {
    try {
      // Basic Validation (add more comprehensive validation here)
      if (!leadData.first_name || !leadData.last_name || !leadData.phone) {
        throw new Error('Missing required fields');
      }

      // Validate phone number format (example using a regular expression)
      const phoneRegex = /^\+\d{10,15}$/; // Basic regex for + followed by 10-15 digits
      if (!phoneRegex.test(leadData.phone)) {
        throw new Error('Invalid phone number format');
      }

      // --- Check for Duplicates using Data Connect Query ---
      const existingLeads = await dataConnect.query({
        leadsByContact: { // Call the leadsByContact query
          phone: leadData.phone,
          email: leadData.email || null, // Pass email if available
        },
      });

      if (existingLeads && existingLeads.leadsByContact && existingLeads.leadsByContact.length > 0) {
        // Duplicate found, skip insertion
        throw new Error('Duplicate lead (phone or email already exists)');
      }

      // --- Check for Duplicates (Optional but Recommended) ---
      // You might want to query Data Connect to check if a lead with the same phone number already exists
      // const existingLead = await dataConnect.query(...); // Implement duplicate check query
      // if (existingLead) {
      //   throw new Error('Duplicate lead');
      // }

      // --- Prepare data for Data Connect insertion ---
      const leadToInsert = {
        firstName: leadData.first_name, // Map CSV column to schema field
        lastName: leadData.last_name,
        phone: leadData.phone,
        email: leadData.email || null, // Handle optional fields
        address: leadData.address || null,
        createdAt: new Date().toISOString(),
        status: 'NO_REPLY', // Default status for new leads
        importedBy: userId,
      };

      // --- Insert into Lead table using Data Connect ---
      const result = await dataConnect.mutate({
        insertLead: leadToInsert, // Assuming you have an 'insertLead' mutation in your Data Connect schema
      });

      successfulImports.push(leadData); // Add to successful list

    } catch (error) {
      console.error('Error importing lead:', leadData, error);
      failedImports.push({ data: leadData, error: error.message }); // Add to failed list
    }
  }

  // --- Generate Notification ---
  let notificationMessage = '';
  let notificationType = 'LeadImportResult'; // A generic type, you might want more specific types

  if (successfulImports.length > 0 && failedImports.length === 0) {
    notificationMessage = `${successfulImports.length} leads successfully added to your system.`;
    notificationType = 'LeadImportSuccess';
  } else if (successfulImports.length > 0 && failedImports.length > 0) {
    notificationMessage = `${successfulImports.length} leads imported, but ${failedImports.length} failed.`;
    notificationType = 'LeadImportPartial';
  } else {
    notificationMessage = `Lead import failed. ${failedImports.length} records had errors.`;
    notificationType = 'LeadImportFailed';
  }

  // Create a notification for the user
  try {
    await dataConnect.mutate({
      insertNotification: { // Assuming you have an 'insertNotification' mutation
        userId: userId,
        type: notificationType,
        message: notificationMessage,
        status: 'NEW', // Default status for a new notification
      },
    });
  } catch (notificationError) {
    console.error('Error creating import notification:', notificationError);
    // Continue without throwing an error, as the import itself might have been partially successful
    failedImports.push({ data: null, error: 'Failed to create import notification.' });
  }

  // Return a summary of the import results to the frontend
  return {
    successful: successfulImports.length,
    failed: failedImports,
    message: notificationMessage,
  };
});
