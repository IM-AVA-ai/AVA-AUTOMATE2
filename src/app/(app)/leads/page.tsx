import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileUp, Plus, Search } from "lucide-react";

export default function LeadsPage() {
  // Placeholder data - replace with actual data fetching
  const leads = [
    { id: '1', name: 'John Doe', phone: '+15551234567', status: 'New', added: '2024-07-28' },
    { id: '2', name: 'Jane Smith', phone: '+15559876543', status: 'Contacted', added: '2024-07-27' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Leads</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <FileUp className="mr-2 h-4 w-4" /> Import CSV
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Lead
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Leads</CardTitle>
          <CardDescription>View, add, import, and manage your leads.</CardDescription>
            <div className="relative mt-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search leads..." className="pl-8 w-full sm:w-[300px]" />
            </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.length > 0 ? (
                leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>{lead.name}</TableCell>
                    <TableCell>{lead.phone}</TableCell>
                    <TableCell>{lead.status}</TableCell>
                    <TableCell>{lead.added}</TableCell>
                    <TableCell>
                       {/* Add action buttons (e.g., Edit, Delete) */}
                       <Button variant="ghost" size="icon">...</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No leads found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
           {/* Add Pagination controls here if needed */}
        </CardContent>
      </Card>
    </div>
  );
}
