import React from 'react';

const DashboardPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Overview Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="text-gray-600">
          Welcome to your dashboard! Here you can get a quick overview of your
          campaigns, leads, and overall performance.
        </p>
      </section>

      {/* Key Metrics Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Leads Card */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-medium">Total Leads</h3>
            <p className="text-2xl mt-2">--</p>
          </div>
          {/* New Leads Card */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-medium">New Leads</h3>
            <p className="text-2xl mt-2">--</p>
          </div>
          {/* Campaigns Card */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-medium">Campaigns</h3>
            <p className="text-2xl mt-2">--</p>
          </div>
          {/* Messages Sent Card */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-medium">Messages Sent</h3>
            <p className="text-2xl mt-2">--</p>
          </div>
        </div>
      </section>

      {/* Recent Activities Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Recent Activities</h2>
        <ul className="space-y-2">
          <li className="bg-white p-3 rounded-md shadow-sm">
            <p>Activity 1 - Placeholder</p>
          </li>
          <li className="bg-white p-3 rounded-md shadow-sm">
            <p>Activity 2 - Placeholder</p>
          </li>
          <li className="bg-white p-3 rounded-md shadow-sm">
            <p>Activity 3 - Placeholder</p>
          </li>
          <li className="bg-white p-3 rounded-md shadow-sm">
            <p>Activity 4 - Placeholder</p>
          </li>
          <li className="bg-white p-3 rounded-md shadow-sm">
            <p>Activity 5 - Placeholder</p>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default DashboardPage;
