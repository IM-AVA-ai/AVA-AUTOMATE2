tsx
"use client";

import { addToast } from "@heroui/toast";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getLead, updateLead, Lead } from "@/services/leads";
import { Button, Input, Label, Textarea, Select } from "@heroui/react";
import { currentUser } from "@clerk/nextjs";

export default function EditLeadPage() {
  const router = useRouter();
  const params = useParams();
  const leadId = params.id as string;
  const [lead, setLead] = useState<Lead | null>(null);

  useEffect(() => {
    const fetchLead = async () => {
        const user = await currentUser();
        if (!user) return;
      const fetchedLead = await getLead(user.id, leadId);
      if (fetchedLead) {
        setLead(fetchedLead);
      } else {
        addToast({ message: "Lead not found", type: "danger" });
        router.push("/leads");
      }
    };
    fetchLead();
  }, [leadId, router]);

  const handleInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setLead((prevLead) =>
      prevLead ? { ...prevLead, [name]: value } : null
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const user = await currentUser();
    if (!user || !lead) return;

    try {
      await updateLead(leadId, lead, user.id);
      addToast({ message: "Lead updated successfully!" });
      router.push("/leads");
    } catch (error) {
      addToast({ message: "Error updating lead", type: "danger" });
    }
  };

  const handleCancel = () => {
    router.push("/leads");
  };

  if (!lead) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Lead</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name" className="dark:text-white">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={lead.name}
            onChange={handleInputChange}
            required
            className="dark:text-black"
          />
        </div>
        <div>
          <Label htmlFor="phone" className="dark:text-white">Phone</Label>
          <Input
            type="text"
            id="phone"
            name="phone"
            value={lead.phone}
            onChange={handleInputChange}
            required
            className="dark:text-black"
          />
        </div>
        <div>
          <Label htmlFor="email" className="dark:text-white">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={lead.email || ""}
            onChange={handleInputChange}
            className="dark:text-black"
          />
        </div>
        <div>
          <Label htmlFor="city" className="dark:text-white">City</Label>
          <Input
            type="text"
            id="city"
            name="city"
            value={lead.city || ""}
            onChange={handleInputChange}
            className="dark:text-black"
          />
        </div>
        <div>
          <Label htmlFor="state" className="dark:text-white">State</Label>
          <Input
            type="text"
            id="state"
            name="state"
            value={lead.state || ""}
            onChange={handleInputChange}
            className="dark:text-black"
          />
        </div>
        <div>
          <Label htmlFor="country" className="dark:text-white">Country</Label>
          <Input
            type="text"
            id="country"
            name="country"
            value={lead.country || ""}
            onChange={handleInputChange}
            className="dark:text-black"
          />
        </div>
        <div>
          <Label htmlFor="source" className="dark:text-white">Source</Label>
          <Input
            type="text"
            id="source"
            name="source"
            value={lead.source || ""}
            onChange={handleInputChange}
            className="dark:text-black"
          />
        </div>
        <div>
          <Label htmlFor="notes" className="dark:text-white">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            value={lead.notes || ""}
            onChange={handleInputChange}
            className="dark:text-black"
          />
        </div>
        <div>
          <Label htmlFor="status" className="dark:text-white">Status</Label>
          <Select
            id="status"
            name="status"
            value={lead.status}
            onChange={handleInputChange}
            className="dark:text-black"
          >
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </Select>
        </div>
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="light" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
}