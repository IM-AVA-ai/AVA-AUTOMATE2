import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Play, Pause, BarChart } from "lucide-react";

export default function CampaignsPage() {
   // Placeholder data - replace with actual data fetching
  const campaigns = [
    { id: '1', name: 'Summer Solar Promo', agent: 'Solar Sales Agent', status: 'Active', leads: 150, sent: 120, replies: 15, created: '2024-07-28' },
    { id: '2', name: 'Roof Inspection Offer', agent: 'Roofing Lead Qualifier', status: 'Paused', leads: 200, sent: 180, replies: 25, created: '2024-07-25' },
    { id: '3', name: 'Q3 Follow-up', agent: 'General Follow-up', status: 'Completed', leads: 100, sent: 100, replies: 8, created: '2024-07-20' },
  ];

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case 'active': return 'default'; // Using primary color
      case 'paused': return 'secondary';
      case 'completed': return 'outline'; // Use outline for completed
      case 'draft': return 'outline';
      case 'failed': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">SMS Campaigns</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Campaign
        </Button>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>Manage Campaigns</CardTitle>
          <CardDescription>Initiate, monitor, and manage your SMS campaigns.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>AI Agent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Leads</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Replies</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.length > 0 ? (
                campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>{campaign.agent}</TableCell>
                    <TableCell><Badge variant={getStatusBadgeVariant(campaign.status)}>{campaign.status}</Badge></TableCell>
                    <TableCell>{campaign.leads}</TableCell>
                    <TableCell>{campaign.sent}</TableCell>
                    <TableCell>{campaign.replies}</TableCell>
                    <TableCell>{campaign.created}</TableCell>
                    <TableCell className="flex gap-1">
                       {/* Action buttons based on status */}
                       {campaign.status === 'Active' && <Button variant="ghost" size="icon" title="Pause"><Pause className="h-4 w-4" /></Button>}
                       {campaign.status === 'Paused' && <Button variant="ghost" size="icon" title="Resume"><Play className="h-4 w-4" /></Button>}
                       <Button variant="ghost" size="icon" title="View Stats"><BarChart className="h-4 w-4" /></Button>
                       <Button variant="ghost" size="icon" title="More Actions">...</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">No campaigns created yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
