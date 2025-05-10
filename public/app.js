// Initialize Firebase (replace with your actual Firebase config)
const firebaseConfig = {
    apiKey: "AIzaSyBh3HZGNsMwhJ2xnqeBQwIg_EBKLXH_s68",
    authDomain: "ava-automate2.firebaseapp.com",
    databaseURL: "https://ava-automate2-default-rtdb.firebaseio.com",
    projectId: "ava-automate2",
    storageBucket: "ava-automate2.firebasestorage.app",
    messagingSenderId: "381160095911",
    appId: "1:381160095911:web:8cc9bdcd3adcee42b4db82",
    measurementId: "G-0FM6NXN4SB"
  };
 
  firebase.initializeApp(firebaseConfig);
  
  const auth = firebase.auth();
  const functions = firebase.functions();
  
  // Get references to HTML elements
  const csvFile = document.getElementById('csvFile');
  const uploadButton = document.getElementById('uploadButton');
  const statusMessage = document.getElementById('statusMessage');
  
  // Add event listener to the upload button
  uploadButton.addEventListener('click', async () => {
    const file = csvFile.files[0];
  
    if (!file) {
      statusMessage.textContent = 'Please select a CSV file.';
      return;
    }
  
    const reader = new FileReader();
  
    reader.onload = async (event) => {
      const csvData = event.target.result;
  
      // Display a status message
      statusMessage.textContent = 'Uploading and importing leads...';
  
      try {
        // Call the Cloud Function
        const importLeads = functions.httpsCallable('importLeadsFromCSV'); // 'importLeadsFromCSV' should match your function name
        const result = await importLeads({ csvData: csvData });
  
        // Handle the result from the Cloud Function
        if (result.data && result.data.successful > 0) {
          statusMessage.textContent = `Import successful! ${result.data.successful} leads imported.`;
          if (result.data.failed && result.data.failed.length > 0) {
            statusMessage.textContent += ` ${result.data.failed.length} leads failed to import. Check logs for details.`;
          }
        } else if (result.data && result.data.failed && result.data.failed.length > 0) {
          statusMessage.textContent = `Import failed! ${result.data.failed.length} leads had errors. Check logs for details.`;
        } else {
          statusMessage.textContent = 'Import failed. No leads were imported.';
        }
  
      } catch (error) {
        console.error('Error calling Cloud Function:', error);
        statusMessage.textContent = `Error during import: ${error.message}`;
      }
    };
  
    // Read the CSV file as text
    reader.readAsText(file);
  });
  
  // Optional: Add Firebase Authentication listener to ensure user is logged in
  auth.onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, enable the upload button
      uploadButton.disabled = false;
    } else {
      // User is signed out, disable the upload button
      uploadButton.disabled = true;
      statusMessage.textContent = 'Please sign in to import leads.';
    }
  });
  