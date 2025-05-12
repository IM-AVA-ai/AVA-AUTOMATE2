'use client';

import React, { useState } from 'react';
import { useAuth } from '@/firebase/auth-context'; // Assuming useAuth is exported from here
import { addToast } from '@heroui/toast'; // Assuming addToast is available

const TwilioSettingsPage: React.FC = () => {
  const { user } = useAuth(); // Get current user
  const [accountSid, setAccountSid] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // TODO: Optionally fetch existing Twilio settings for the user on component mount
  // useEffect(() => {
  //   if (user) {
  //     // Fetch settings from your backend API or database
  //     // and set the state variables (setAccountSid, setAuthToken, setPhoneNumber)
  //   }
  // }, [user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user) {
      addToast({ title: "Error", description: "You must be logged in to save settings.", variant: "solid" });
      return;
    }

    if (!accountSid || !authToken || !phoneNumber) {
      addToast({ title: "Missing Information", description: "Please fill in all fields.", variant: "solid" });
      return;
    }

    setIsSaving(true);

    try {
      // Send data to your new backend API route
      const response = await fetch('/api/save-twilio-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include user's ID token for authentication on the backend
          'Authorization': `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify({
          accountSid,
          authToken,
          phoneNumber,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        addToast({ title: "Success", description: "Twilio settings saved successfully." });
        // TODO: Optionally update local state or refetch settings
      } else {
        addToast({ title: "Error", description: result.error || "Failed to save settings.", variant: "solid" });
      }

    } catch (error: any) {
      console.error('Error saving Twilio settings:', error);
      addToast({ title: "Error", description: error.message || "An unexpected error occurred.", variant: "solid" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Twilio Settings</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Enter Your Twilio Credentials</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="accountSid" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account SID</label>
            <input
              id="accountSid"
              type="text"
              value={accountSid}
              onChange={(e) => setAccountSid(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="authToken" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Auth Token</label>
            <input
              id="authToken"
              type="text"
              value={authToken}
              onChange={(e) => setAuthToken(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Twilio Phone Number</label>
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="+15551234567"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving || !user}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TwilioSettingsPage;
