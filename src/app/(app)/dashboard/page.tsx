import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            {/* Add icon here */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No active campaigns currently</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
             {/* Add icon here */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Add leads to get started</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Sent (Today)</CardTitle>
             {/* Add icon here */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
             <p className="text-xs text-muted-foreground">No messages sent yet today</p>
          </CardContent>
        </Card>
      </div>
       <Card>
         <CardHeader>
            <CardTitle>Overview</CardTitle>
         </CardHeader>
         <CardContent>
            <p>Welcome to AVA Automate! Manage your leads, create AI agents, run SMS campaigns, and view messages all from one place.</p>
         </CardContent>
       </Card>
    </div>
  );
}
