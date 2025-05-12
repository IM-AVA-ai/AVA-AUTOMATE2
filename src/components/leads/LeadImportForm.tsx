"use client";


import React, { useState } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";

// Define the Lead type (adjust fields as needed)
type Lead = {
  id: string;
  name: string;
  email: string;
  [key: string]: any;
};

interface LeadImportFormProps {
  onImport: (importedLeads: Lead[]) => void;
  onCancel?: () => void;
}

const LeadImportForm: React.FC<LeadImportFormProps> = ({ onImport, onCancel }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setStatusMessage("");
    } else {
      setSelectedFile(null);
      setStatusMessage("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setStatusMessage("Please select a CSV file.");
      return;
    }

    setIsUploading(true);
    setStatusMessage("Uploading and importing leads...");

    const reader = new FileReader();

    reader.onload = async (event) => {
      const csvData = event.target?.result as string;

      try {
        const functions = getFunctions();
        const importLeads = httpsCallable(functions, "importLeadsFromCSV");
        const result = await importLeads({ csvData });

        // Assume the cloud function returns { leads: Lead[], successful: number, failed: Lead[] }
        const data = result.data as any;
        if (data && Array.isArray(data.leads) && data.successful > 0) {
          setStatusMessage(`Import successful! ${data.successful} leads imported.`);
          onImport(data.leads);
          if (data.failed && data.failed.length > 0) {
            setStatusMessage(prev => prev + ` ${data.failed.length} leads failed to import. Check logs for details.`);
          }
        } else if (data && data.failed && data.failed.length > 0) {
          setStatusMessage(`Import failed! ${data.failed.length} leads had errors. Check logs for details.`);
        } else {
          setStatusMessage("Import failed. No leads were imported.");
        }
      } catch (error: any) {
        console.error("Error calling Cloud Function:", error);
        setStatusMessage(`Error during import: ${error.message}`);
      } finally {
        setIsUploading(false);
      }
    };

    reader.readAsText(selectedFile);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Import Leads from CSV</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleUpload}
          disabled={isUploading || !selectedFile}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isUploading ? "Uploading..." : "Upload CSV"}
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            disabled={isUploading}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        )}
      </div>
      {statusMessage && <p className="mt-2 text-sm">{statusMessage}</p>}
    </div>
  );
};

export default LeadImportForm;
