'use client'; // Needed for state management

import React, { useState } from 'react';

export default function SettingsPage() {
  // Placeholder state - remove user-specific data fetched from auth
  const [settingsData, setSettingsData] = useState({
    name: 'Admin User', // Keep name or make it configurable differently
    twilioAccountSid: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Keep integration settings
    twilioAuthToken: '••••••••••••••••••••••••••••', // Use password type for input
    twilioPhoneNumber: '+15551234567',
    enableEmailNotifications: true,
    defaultAgentId: '1',
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false); // Example loading state

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    if (type === 'checkbox') {
        // Handle checkbox toggle specifically for Switch replacement
        const { checked } = e.target as HTMLInputElement;
        setSettingsData(prev => ({ ...prev, [id]: checked }));
    } else {
        setSettingsData(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettingsData(prev => ({...prev, enableEmailNotifications: e.target.checked}));
  }

  const handleSave = async (section: string) => {
    setIsLoading(true);
    console.log(`Saving ${section} settings:`, settingsData);
    // TODO: Implement actual saving logic (e.g., API call, Firestore update)
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate save
    setIsLoading(false);
    alert(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved!`); // Simple feedback
  };

  const tabButtonStyle = (tabName: string) => `
    px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    ${activeTab === tabName
      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
  `;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>

      {/* Basic Tabs Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          <button onClick={() => setActiveTab('profile')} className={tabButtonStyle('profile')}>
            Profile
          </button>
          <button onClick={() => setActiveTab('integrations')} className={tabButtonStyle('integrations')}>
            Integrations
          </button>
          <button onClick={() => setActiveTab('notifications')} className={tabButtonStyle('notifications')}>
            Notifications
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {/* Profile Settings */}
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Settings</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your application settings.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  value={settingsData.name}
                  onChange={handleInputChange}
                  className="block w-full max-w-xs px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <button
                onClick={() => handleSave('profile')}
                disabled={isLoading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Update Profile'}
              </button>
            </div>
          </div>
        )}

        {/* Integrations Settings */}
        {activeTab === 'integrations' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
             <div>
               <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Twilio Integration</h2>
               <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure your Twilio account for sending SMS.</p>
             </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="twilioAccountSid" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account SID</label>
                <input
                  type="text"
                  id="twilioAccountSid"
                  value={settingsData.twilioAccountSid}
                  onChange={handleInputChange}
                  placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="block w-full max-w-md px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="twilioAuthToken" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Auth Token</label>
                <input
                  type="password" // Use password type
                  id="twilioAuthToken"
                  value={settingsData.twilioAuthToken}
                  onChange={handleInputChange}
                  className="block w-full max-w-md px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="twilioPhoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Twilio Phone Number</label>
                <input
                  type="tel"
                  id="twilioPhoneNumber"
                  value={settingsData.twilioPhoneNumber}
                  onChange={handleInputChange}
                  placeholder="+1xxxxxxxxxx"
                  className="block w-full max-w-xs px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <button
                onClick={() => handleSave('integrations')}
                disabled={isLoading}
                 className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
               >
                 {isLoading ? 'Saving...' : 'Save Twilio Settings'}
              </button>
            </div>
          </div>
        )}

        {/* Notifications Settings */}
        {activeTab === 'notifications' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notification Preferences</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage how you receive notifications.</p>
            </div>
            <div className="space-y-4">
               {/* HeroUI-style Toggle/Switch */}
               <div className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg">
                 <div>
                   <label htmlFor="enableEmailNotifications" className="font-medium text-gray-900 dark:text-white cursor-pointer">Email Notifications</label>
                   <p className="text-sm text-gray-500 dark:text-gray-400">
                     Receive important updates via email (requires configuration).
                   </p>
                 </div>
                 <label htmlFor="enableEmailNotifications" className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        id="enableEmailNotifications"
                        className="sr-only peer"
                        checked={settingsData.enableEmailNotifications}
                        onChange={handleSwitchChange}
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
                </label>
               </div>
               {/* Add more notification toggles */}
               <button
                 onClick={() => handleSave('notifications')}
                 disabled={isLoading}
                 className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
               >
                 {isLoading ? 'Saving...' : 'Save Notification Settings'}
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
