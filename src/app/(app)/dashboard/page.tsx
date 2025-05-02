import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, BarChartHorizontal, Bot, MessageSquare, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  // Placeholder data - replace with actual data fetching
  const recentCampaigns = [
    { id: '1', name: 'Summer Solar Promo', status: 'Active', sent: 120, replies: 15 },
    { id: '2', name: 'Roof Inspection Offer', status: 'Paused', sent: 180, replies: 25 },
    { id: '3', name: 'Q3 Follow-up', status: 'Completed', sent: 100, replies: 8 },
  ];

  const activityFeed = [
      { id: 'a1', type: 'lead', text: 'New lead "Alice Green" added.', time: '2m ago' },
      { id: 'a2', type: 'campaign', text: 'Campaign "Summer Solar Promo" started.', time: '1h ago' },
      { id: 'a3', type: 'message', text: 'New reply received from John Doe.', time: '3h ago' },
      { id: 'a4', type: 'agent', text: 'Agent "Roofing Lead Qualifier" created.', time: '1d ago' },
  ];

   const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case 'active': return 'default';
      case 'paused': return 'secondary';
      case 'completed': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div> {/* Placeholder */}
            <p className="text-xs text-muted-foreground">+1 since last week</p> {/* Placeholder */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
             <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">205</div> {/* Placeholder */}
            <p className="text-xs text-muted-foreground">+10 this month</p> {/* Placeholder */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Sent (Today)</CardTitle>
             <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85</div> {/* Placeholder */}
             <p className="text-xs text-muted-foreground">Updated 5 mins ago</p> {/* Placeholder */}
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reply Rate (Overall)</CardTitle>
             <BarChartHorizontal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12%</div> {/* Placeholder */}
             <p className="text-xs text-muted-foreground">Based on all campaigns</p> {/* Placeholder */}
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
         <Card className="lg:col-span-3">
           <CardHeader>
              <CardTitle>Recent Campaigns Summary</CardTitle>
              <CardDescription>Quick overview of your latest SMS campaigns.</CardDescription>
           </CardHeader>
           <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent</TableHead>
                    <TableHead>Replies</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentCampaigns.length > 0 ? (
                    recentCampaigns.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell className="font-medium">{campaign.name}</TableCell>
                        <TableCell><Badge variant={getStatusBadgeVariant(campaign.status)}>{campaign.status}</Badge></TableCell>
                        <TableCell>{campaign.sent}</TableCell>
                        <TableCell>{campaign.replies}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">No recent campaigns.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
           </CardContent>
         </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Activity Feed</CardTitle>
              <CardDescription>Latest updates and notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
             {activityFeed.length > 0 ? (
                 activityFeed.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                        <div className="pt-1">
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm">{activity.text}</p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                    </div>
                 ))
             ) : (
                <p className="text-center text-muted-foreground">No recent activity.</p>
             )}

            </CardContent>
          </Card>
       </div>

       <Card>
         <CardHeader>
            <CardTitle>Welcome to AVA Automate!</CardTitle>
         </CardHeader>
         <CardContent>
            <p className="text-muted-foreground">Manage your leads, configure AI agents, launch SMS campaigns, and monitor conversations all from this dashboard. Use the sidebar to navigate between sections.</p>
            {/* Could add quick action buttons here */}
         </CardContent>
       </Card>
    </div>
  );
}
