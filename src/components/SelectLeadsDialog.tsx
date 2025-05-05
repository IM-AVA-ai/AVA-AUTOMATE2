"use client";

import {
    addToast,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Checkbox,
    useDisclosure
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
import { useUser } from "@clerk/nextjs";

interface SelectLeadsDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSelect: (selectedLeadIds: string[]) => void;
}

export default function SelectLeadsDialog({
  open,
  setOpen,
  onSelect,
}: SelectLeadsDialogProps) {
  interface Lead {
    id: string;
    name: string;
    phone: string;
    [key: string]: any;
  }
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const { user } = useUser();
  const {isOpen, onOpen, onOpenChange} = useDisclosure({
    isOpen: open,
    onChange: setOpen,
  });


  useEffect(() => {
    const fetchLeads = async () => {
      if (user) {
        const fetchedLeads = await getLeads(user.id);
        setLeads(fetchedLeads);
      }
    };
    fetchLeads();
  }, [user]);

  const handleCheckboxChange = (leadId: string) => {
    setSelectAll(false);
    setSelectedLeads((prevSelectedLeads) => {
      if (prevSelectedLeads.includes(leadId)) {
        return prevSelectedLeads.filter((id) => id !== leadId);
      } else {
        return [...prevSelectedLeads, leadId];
      }
    });
  };

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
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent className="sm:max-w-[425px]">
        <ModalHeader>
          Select Leads
        </ModalHeader>
        <ModalBody>
          <div className="space-y-2">
            <div className="flex items-center">
              <Checkbox
                id="selectAll"
                isSelected={selectAll}
                onValueChange={handleSelectAllChange}
                className="mr-2"
              />
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
                    <TableCell>{lead.name}</TableCell>
                    <TableCell>{lead.phone}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button type="button" variant="light" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleConfirm} disabled={selectedLeads.length === 0}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
