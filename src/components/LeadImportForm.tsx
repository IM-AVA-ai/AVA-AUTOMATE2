'use client';

import React, { useState, useEffect } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useAuth } from '@/firebase/auth-context'; // Assuming useAuth is exported from here

const LeadImportForm: React.FC = () => {
  const { user } = useAuth(); // Get user from auth context
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);

  // Enable button based on user authentication state
  useEffect(() => {
    setIsButtonEnabled(!!user && !isUploading);
  }, [user, isUploading]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setStatusMessage(''); // Clear status message on new file selection
    } else {
      setSelectedFile(null);
      setStatusMessage('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setStatusMessage('Please select a CSV file.');
      return;
    }

    setIsUploading(true);
    setStatusMessage('Uploading and importing leads...');

    const reader = new FileReader();

    reader.onload = async (event) => {
      const csvData = event.target?.result as string;

      try {
        // Get Firebase Functions instance
        const functions = getFunctions(); // Use default app

        // Get the callable function
        const importLeads = httpsCallable(functions, 'importLeadsFromCSV'); // 'importLeadsFromCSV' should match your function name

        // Call the Cloud Function
        const result = await importLeads({ csvData: csvData });

        // Handle the result from the Cloud Function
        if (result.data && (result.data as any).successful > 0) {
          setStatusMessage(`Import successful! ${(result.data as any).successful} leads imported.`);
          if ((result.data as any).failed && (result.data as any).failed.length > 0) {
            setStatusMessage(prev => prev + ` ${(result.data as any).failed.length} leads failed to import. Check logs for details.`);
          }
        } else if (result.data && (result.data as any).failed && (result.data as any).failed.length > 0) {
          setStatusMessage(`Import failed! ${(result.data as any).failed.length} leads had errors. Check logs for details.`);
        } else {
          setStatusMessage('Import failed. No leads were imported.');
        }

      } catch (error: any) {
        console.error('Error calling Cloud Function:', error);
        setStatusMessage(`Error during import: ${error.message}`);
      } finally {
        setIsUploading(false);
      }
    };

    // Read the CSV file as text
    reader.readAsText(selectedFile);
  };

  return (
    <div>
      <h2>Import Leads from CSV</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!isButtonEnabled}>
        {isUploading ? 'Uploading...' : 'Upload CSV'}
      </button>
      {statusMessage && <p>{statusMessage}</p>}
    </div>
  );
};

export default LeadImportForm;
