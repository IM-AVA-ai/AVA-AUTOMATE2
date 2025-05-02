import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";

export default function AgentsPage() {
   // Placeholder data - replace with actual data fetching
  const agents = [
    { id: '1', name: 'Solar Sales Agent', industry: 'Solar Energy', created: '2024-07-28' },
    { id: '2', name: 'Roofing Lead Qualifier', industry: 'Roofing', created: '2024-07-27' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">AI Agents</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Agent
        </Button>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>Manage AI Agents</CardTitle>
          <CardDescription>Create and configure AI agents for different industries.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Date Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.length > 0 ? (
                agents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell>{agent.name}</TableCell>
                    <TableCell>{agent.industry}</TableCell>
                    <TableCell>{agent.created}</TableCell>
                    <TableCell>
                       {/* Add action buttons (e.g., Edit, Delete, Customize) */}
                       <Button variant="ghost" size="icon">...</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">No AI agents created yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
