tsx
"use client";


import {
    addToast,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Button,
    Checkbox
} from "@heroui/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { getLeads } from "@/services/leads";
import { useState, useEffect } from "react";
import { currentUser } from "@clerk/nextjs";

interface SelectLeadsDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSelect: (selectedLeadIds: string[]) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSelect: (selectedLeadIds: string[]) => void;
}

export default function SelectLeadsDialog({
  open,
  setOpen,
  onSelect,
}: SelectLeadsDialogProps) {  interface Lead {
    id: string;
    name: string;
    phone: string;
    [key: string]: any;
  }
  const [leads, setLeads] = useState<Lead[]>([]);  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  useEffect(() => {
    console.log("Open dialog:", open);
  }, [open]);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const handleConfirm = () => {

  useEffect(() => {
    const fetchLeads = async () => {
      const user = await currentUser();
      if (user) {
        const fetchedLeads = await getLeads(user.id);
        setLeads(fetchedLeads);
      }
    };
    fetchLeads();
  }, []);

  const handleCheckboxChange = (leadId: string) => {
    setSelectAll(false);    setSelectedLeads((prevSelectedLeads) => {
        setSelectAll(false);    setSelectedLeads((prevSelectedLeads) => {
      if (prevSelectedLeads.includes(leadId)) {
        return prevSelectedLeads.filter((id) => id !== leadId);
      } else {
        return [...prevSelectedLeads, leadId];
      }
    });
  };

      setSelectAll(selectAll ? [] : leads.map((lead) => lead.id));
  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
      setSelectedLeads(selectAll ? [] : leads.map((lead) => lead.id));


  };

  const handleConfirm = () => {
    setOpen(false);
    onSelect(selectedLeads);

  };
  const handleCancel = () => {
        setOpen(false);

  };

  return (
        <Dialog open={open} onOpenChange={setOpen}>
    <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Select Leads</DialogTitle>
                    <DialogDescription>Select the leads to send the campaign.</DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox
                      id="selectAll"
                      isSelected={selectAll}
                      onValueChange={handleSelectAllChange}
                      className="mr-2" />
                    <label htmlFor="selectAll" className="ml-2">Select All</label>
                  </div>
                    <Table aria-label="Leads table">
                        <TableHeader>
                            <TableColumn>Select</TableColumn>
                            <TableColumn>Name</TableColumn>
                           <TableColumn>Phone</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {leads.map((lead) => (
                                <TableRow key={lead.id}>
                                    <TableCell>
                                        <Checkbox
                                            id={`lead-${lead.id}`}
                                            isSelected={selectedLeads.includes(lead.id)}
                                            onValueChange={() => handleCheckboxChange(lead.id)}
                                        />
                                    </TableCell>        
                                    <TableCell>{lead.name}</TableCell>                                    <TableCell>{lead.name}</TableCell>
                                <TableCell>{lead.phone}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <DialogFooter>
                    <Button type="button" variant="light" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleConfirm} disabled={selectedLeads.length === 0}>
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
  );
}