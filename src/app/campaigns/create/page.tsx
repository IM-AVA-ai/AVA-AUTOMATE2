tsx
"use client";

import { addToast } from "@heroui/toast";
import { Button, Input, Label, Select, Textarea } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { currentUser } from "@clerk/nextjs";
import { createCampaign } from "@/services/campaigns";

export default function CreateCampaignPage() {
  const router = useRouter();
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    message: "",
    status: "New",
  });

  const handleInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    const { name, value } = event.target;
    setNewCampaign((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    const user = await currentUser();
    if (!user) return;

    try {
      await createCampaign(user.id, newCampaign);
      addToast({ message: "Campaign created successfully." });
      router.push("/campaigns");
    } catch (error) {
      addToast({ message: "Error creating campaign.", type: "danger" });
    }
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Campaign</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name" className="dark:text-white">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={newCampaign.name}
            onChange={handleInputChange}
            required
            className="dark:text-black"
          />
        </div>
        <div>
          <Label htmlFor="message" className="dark:text-white">Message</Label>
          <Textarea
            id="message"
            name="message"
            value={newCampaign.message}
            onChange={handleInputChange}
            required
            className="dark:text-black"
          />
        </div>
        <div>
          <Label htmlFor="status" className="dark:text-white">Status</Label>
          <Select id="status" name="status" value={newCampaign.status} onChange={handleInputChange} className="dark:text-black">
            <option value="New">New</option>
            <option value="Active">Active</option>
            <option value="Paused">Paused</option>
            <option value="Completed">Completed</option>
          </Select>
        </div>
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="light" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit">Create Campaign</Button>
        </div>
      </form>
    </div>
  );
}