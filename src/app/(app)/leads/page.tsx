'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FileUp, Plus, Search, Trash2, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast'; // Import useToast

// Placeholder Lead type - replace with actual type from Firestore
interface Lead {
  id: string;
  name: string;
  phone: string;
  status: string; // e.g., 'New', 'Contacted', 'Qualified', 'Not Interested'
  added: string; // Consider using Date type
}

// Placeholder hook for fetching leads - replace with actual implementation
const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate fetching data
    const timer = setTimeout(() => {
      try {
         // Replace with actual Firestore fetching logic
         setLeads([
           { id: '1', name: 'John Doe', phone: '+15551234567', status: 'New', added: '2024-07-28' },
           { id: '2', name: 'Jane Smith', phone: '+15559876543', status: 'Contacted', added: '2024-07-27' },
           { id: '3', name: 'Bob Johnson', phone: '+15551112233', status: 'Qualified', added: '2024-07-26' },
         ]);
         setLoading(false);
      } catch (err) {
         setError(err instanceof Error ? err : new Error('Failed to fetch leads'));
         setLoading(false);
      }
    }, 1000); // Simulate 1 second loading

    return () => clearTimeout(timer);
  }, []);

  // Placeholder function to add a lead
  const addLead = async (newLeadData: Omit<Lead, 'id' | 'added' | 'status'>): Promise<Lead> => {
     // Simulate adding to Firestore and return the new lead object
     console.log("Adding lead (placeholder):", newLeadData);
     await new Promise(resolve => setTimeout(resolve, 500));
     const newLead: Lead = {
         id: `lead-${Date.now()}`,
         ...newLeadData,
         status: 'New',
         added: new Date().toISOString().split('T')[0],
     };
     setLeads(prev => [newLead, ...prev]);
     return newLead;
  };

  return { leads, loading, error, addLead };
};


export default function LeadsPage() {
  const { leads, loading, error, addLead } = useLeads();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const { toast } = useToast(); // Initialize toast


  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedLeads(new Set(filteredLeads.map(lead => lead.id)));
    } else {
      setSelectedLeads(new Set());
    }
  };

  const handleSelectLead = (leadId: string, checked: boolean | 'indeterminate') => {
    setSelectedLeads(prev => {
      const newSelection = new Set(prev);
      if (checked === true) {
        newSelection.add(leadId);
      } else {
        newSelection.delete(leadId);
      }
      return newSelection;
    });
  };

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone.includes(searchTerm)
  );

  const isAllSelected = filteredLeads.length > 0 && selectedLeads.size === filteredLeads.length;
  const isIndeterminate = selectedLeads.size > 0 && selectedLeads.size < filteredLeads.length;

   const handleAddLeadSubmit = async (e: React.FormEvent) => {
       e.preventDefault();
       if (!newLeadName || !newLeadPhone) {
           toast({
               title: "Missing Information",
               description: "Please enter both name and phone number.",
               variant: "destructive",
           });
           return;
       }
       // Basic phone validation (example)
       if (!/^\+?[1-9]\d{1,14}$/.test(newLeadPhone)) {
            toast({
                title: "Invalid Phone Number",
                description: "Please enter a valid phone number (e.g., +15551234567).",
                variant: "destructive",
            });
           return;
       }

       try {
           await addLead({ name: newLeadName, phone: newLeadPhone });
           toast({
               title: "Lead Added",
               description: `${newLeadName} has been added successfully.`,
           });
           setNewLeadName('');
           setNewLeadPhone('');
           setIsAddLeadOpen(false); // Close the dialog
       } catch (err) {
           toast({
               title: "Failed to Add Lead",
               description: err instanceof Error ? err.message : "An unknown error occurred.",
               variant: "destructive",
           });
       }
   };

   const handleImportCsv = () => {
     // TODO: Implement CSV import logic (e.g., open file dialog, parse CSV)
     console.log("Import CSV clicked");
     toast({
        title: "Import CSV",
        description: "CSV import functionality is not yet implemented.",
     });
   };

   const handleBulkDelete = () => {
     // TODO: Implement bulk delete logic
     console.log("Deleting selected leads:", Array.from(selectedLeads));
      toast({
        title: "Bulk Delete",
        description: `Delete functionality for ${selectedLeads.size} leads is not yet implemented.`,
        variant: "destructive",
     });
   }

    const handleBulkAddToCampaign = () => {
     // TODO: Implement adding selected leads to a campaign queue
     // This might involve navigating to the campaign page or opening a campaign selection modal
     console.log("Adding selected leads to campaign:", Array.from(selectedLeads));
      toast({
        title: "Add to Campaign",
        description: `Functionality to add ${selectedLeads.size} leads to a campaign is not yet implemented.`,
     });
   }


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Leads</h1>
        <div className="flex items-center gap-2 flex-wrap">
         {selectedLeads.size > 0 && (
             <>
              <Button variant="outline" onClick={handleBulkAddToCampaign} disabled={loading}>
                <Send className="mr-2 h-4 w-4" /> Add to Campaign ({selectedLeads.size})
              </Button>
              <Button variant="destructive" onClick={handleBulkDelete} disabled={loading}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete ({selectedLeads.size})
              </Button>
            </>
          )}
          <Button variant="outline" onClick={handleImportCsv} disabled={loading}>
            <FileUp className="mr-2 h-4 w-4" /> Import CSV
          </Button>
           <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
              <DialogTrigger asChild>
                <Button disabled={loading}>
                  <Plus className="mr-2 h-4 w-4" /> Add Lead
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleAddLeadSubmit}>
                    <DialogHeader>
                    <DialogTitle>Add New Lead</DialogTitle>
                    <DialogDescription>
                        Manually enter the details for a new lead.
                    </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                        Name
                        </Label>
                        <Input
                        id="name"
                        value={newLeadName}
                        onChange={(e) => setNewLeadName(e.target.value)}
                        className="col-span-3"
                        placeholder="John Doe"
                        required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                        Phone
                        </Label>
                        <Input
                        id="phone"
                        value={newLeadPhone}
                        onChange={(e) => setNewLeadPhone(e.target.value)}
                        className="col-span-3"
                        placeholder="+15551234567"
                        required
                        type="tel"
                        />
                    </div>
                    </div>
                    <DialogFooter>
                     <DialogClose asChild>
                       <Button type="button" variant="outline">Cancel</Button>
                     </DialogClose>
                    <Button type="submit">Save Lead</Button>
                    </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Leads</CardTitle>
          <CardDescription>View, add, import, and manage your leads. Select leads to add them to a campaign.</CardDescription>
            <div className="relative mt-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search leads by name or phone..."
                    className="pl-8 w-full sm:w-[300px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={loading}
                />
            </div>
        </CardHeader>
        <CardContent>
          {error && <p className="text-destructive text-center">Error loading leads: {error.message}</p>}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead padding="checkbox" className="w-[50px]">
                   <Checkbox
                        checked={isAllSelected ? true : isIndeterminate ? 'indeterminate' : false}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all leads"
                        disabled={loading || filteredLeads.length === 0}
                    />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Loading leads...
                  </TableCell>
                </TableRow>
              ) : filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <TableRow key={lead.id} data-state={selectedLeads.has(lead.id) ? 'selected' : ''}>
                     <TableCell padding="checkbox">
                       <Checkbox
                            checked={selectedLeads.has(lead.id)}
                            onCheckedChange={(checked) => handleSelectLead(lead.id, checked)}
                            aria-label={`Select lead ${lead.name}`}
                        />
                    </TableCell>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.phone}</TableCell>
                    <TableCell><Badge variant={lead.status === 'New' ? 'secondary' : lead.status === 'Qualified' ? 'default' : 'outline' }>{lead.status}</Badge></TableCell>
                    <TableCell>{lead.added}</TableCell>
                    <TableCell className="text-right">
                       {/* Individual actions (e.g., Edit, Delete, View Details) */}
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" disabled={loading}>...</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                             {/* TODO: Add EditLeadDialog Trigger */}
                             <DropdownMenuItem disabled>Edit</DropdownMenuItem>
                             {/* TODO: Add View Details Link/Action */}
                            <DropdownMenuItem disabled>View Details</DropdownMenuItem>
                            <DropdownMenuSeparator />
                             {/* TODO: Add individual delete functionality */}
                            <DropdownMenuItem className="text-destructive" disabled>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                      {searchTerm ? 'No leads match your search.' : 'No leads found.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
           {/* TODO: Add Pagination controls here if needed */}
        </CardContent>
      </Card>
    </div>
  );
}

// TODO: Create EditLeadDialog component
// TODO: Implement Firestore fetching, adding, updating, deleting leads
// TODO: Implement CSV Import logic
// TODO: Implement Pagination
