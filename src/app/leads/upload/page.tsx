tsx
"use client";

import { addToast } from "@heroui/toast";
import { Button, Card } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { currentUser } from "@clerk/nextjs";
import { createLeadsFromCSV } from "@/services/leads";

export default function UploadLeadsPage() {
  const router = useRouter();
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.type === "text/csv") {
        setCsvFile(file);
      } else {
        addToast({ message: "Invalid file type. Please upload a CSV file.", type: "danger" });
        setCsvFile(null);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!csvFile) {
      addToast({ message: "Please select a CSV file to upload.", type: "danger" });
      return;
    }
    const user = await currentUser();
    if (!user) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const csvData = e.target?.result as string;
      try {
        await createLeadsFromCSV(user.id, csvData);
        addToast({ message: "Leads uploaded successfully!" });
        router.push("/leads");
      } catch (error) {
        addToast({
          message: "Error uploading leads",
          type: "danger",
        });
      }
    };
    reader.readAsText(csvFile);
  };

  const handleCancel = () => {
    router.push("/leads");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Upload Leads</h1>
      <Card className="p-6 space-y-4 dark">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="dark:text-white"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="light" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">Upload Leads</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}