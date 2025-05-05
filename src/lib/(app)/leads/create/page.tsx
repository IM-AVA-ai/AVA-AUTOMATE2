"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs"; // Using useUser hook for client component
import { createLead, NewLead } from '../../../../services/leads'; // Corrected import path
import { addToast } from '@heroui/react';

export default function CreateLeadPage() {
  const router = useRouter();
  const { user } = useUser(); // Get user from the hook
  const [newLead, setNewLead] = useState<NewLead>({
    name: "",
    phone: "",
    status: "New",
  });

  const handleInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setNewLead((prevLead) => ({
      ...prevLead,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return; // Check if user is loaded

    try {
      await createLead(user.id, newLead);
      addToast({ description: "Lead created successfully!" });
      router.push("/leads");
    } catch (error) {
      console.error("Error creating lead:", error); // Log the error for debugging
      addToast({ description: "Error creating lead", color: "danger" });
    }
  };

  const handleCancel = () => {
    router.push("/leads");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Create Lead</h1>
      {/* Replaced Card with div */}
      <div className="p-6 space-y-4 dark">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            {/* Replaced Label with label */}
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 dark:text-white">
              Name
            </label>
            {/* Replaced Input with input */}
            <input
              type="text"
              id="name"
              name="name"
              value={newLead.name}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:text-black dark:border-gray-600 dark:placeholder-gray-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            {/* Replaced Label with label */}
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 dark:text-white">
              Phone
            </label>
            {/* Replaced Input with input */}
            <input
              type="text"
              id="phone"
              name="phone"
              value={newLead.phone}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:text-black dark:border-gray-600 dark:placeholder-gray-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            {/* Replaced Label with label */}
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 dark:text-white">
              Status
            </label>
            {/* Replaced Select with select */}
            <select
              id="status"
              name="status"
              value={newLead.status}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:text-black dark:border-gray-600 dark:placeholder-gray-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Unqualified">Unqualified</option>
            </select>
          </div>
          <div className="flex justify-end space-x-4">
            {/* Replaced Button with button */}
            <button type="button" onClick={handleCancel} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:border-gray-600 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">
              Cancel
            </button>
            {/* Replaced Button with button */}
            <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Create Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
