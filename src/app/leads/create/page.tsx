tsx
"use client";

import { addToast } from "@heroui/toast";
import { Button, Card, Input, Label, Select } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { currentUser } from "@clerk/nextjs";
import { createLead, NewLead } from "@/services/leads";

export default function CreateLeadPage() {
  const router = useRouter();
  const [newLead, setNewLead] = useState<NewLead>({
    name: "",
    phone: "",
    status: "New",
  });

  const handleInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setNewLead((prevLead) => ({
      ...prevLead,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const user = await currentUser();
    if (!user) return;

    try {
      await createLead(user.id, newLead);
      addToast({ message: "Lead created successfully!" });
      router.push("/leads");
    } catch (error) {
      addToast({
        message: "Error creating lead",
        type: "danger",
      });
    }
  };

  const handleCancel = () => {
    router.push("/leads");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Create Lead</h1>
      <Card className="p-6 space-y-4 dark">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="dark:text-white">
              Name
            </Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={newLead.name}
              onChange={handleInputChange}
              required
              className="mt-1 dark:text-black"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="dark:text-white">
              Phone
            </Label>
            <Input
              type="text"
              id="phone"
              name="phone"
              value={newLead.phone}
              onChange={handleInputChange}
              required
              className="mt-1 dark:text-black"
            />
          </div>
          <div>
            <Label htmlFor="status" className="dark:text-white">
              Status
            </Label>
            <Select
              id="status"
              name="status"
              value={newLead.status}
              onChange={handleInputChange}
              className="mt-1 dark:text-black"
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Unqualified">Unqualified</option>
            </Select>
          </div>
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="light" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">Create Lead</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}