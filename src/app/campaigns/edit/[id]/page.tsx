tsx
"use client";
import { currentUser } from "@clerk/nextjs";
import { addToast } from "@heroui/toast";
import { useState, useEffect } from "react";
import {
  getCampaign,
  sendCampaign,
  updateCampaign,
  Campaign,
} from "@/services/campaigns";
import {
  Button,
  Input,
  Label,
  Textarea,
  Select, DialogTrigger
} from "@heroui/react";
import SelectLeadsDialog from "@/components/SelectLeadsDialog";
import { useParams, useRouter } from "next/navigation";

export default function EditCampaignPage() {
  const params = useParams();
    const [open, setOpen] = useState(false);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const router = useRouter();
    const campaignId = params.id as string;
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  useEffect(() => {
    const fetchCampaign = async () => {
      const user = await currentUser();
            if (!user) return;
      const fetchedCampaign = await getCampaign(user.id, campaignId);
      if (fetchedCampaign) {
        setCampaign(fetchedCampaign);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const handleSendCampaign = async (selectedLeadIds: string[]) => {
    if (!userId || !campaignId) return;
    try {
      const isSent = await sendCampaign(userId, campaignId, selectedLeadIds);
      if (isSent) {
        addToast({ message: "Campaign sent successfully!" });
      } else {
        addToast({ message: "Some messages failed to send.", type: "warning" });

      } else {
        addToast({ message: "Campaign not found", type: "danger" });
        router.push("/campaigns");
      }
    };fetchCampaign();
  }, [campaignId, router]);
const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await currentUser();
      if (user) {
        setUserId(user.id);
      }
    };fetchUser();
  }, []);
  const handleSendCampaign = async (selectedLeadIds: string[]) => {
        if (!userId || !campaignId) return;
        try {
            await sendCampaign(userId, campaignId, selectedLeadIds);
        addToast({ message: "Campaign sent successfully!" });
        } catch (error) {
            addToast({ message: "Some messages failed to send.", type: "warning" });        }
  };
  const handleInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement> 
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setCampaign((prevCampaign) =>
            prevCampaign ? { ...prevCampaign, [name]: value } : null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const user = await currentUser();
    if (!user || !campaign) return;
    
    try {
      await updateCampaign(user.id, campaignId, campaign);
      addToast({ message: "Campaign updated successfully!" });
      router.push("/campaigns");
    } catch (error) {
      addToast({ message: "Error updating campaign", type: "danger" });
    }
  };

  const handleCancel = () => {
    router.push("/campaigns");
  };

  if (!campaign) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Campaign</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name" className="dark:text-white">
            Name
          </Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={campaign.name}
            onChange={handleInputChange}
            required
            className="dark:text-black"
          />
        </div>
        <div>
          <Label htmlFor="message" className="dark:text-white">
            Message
          </Label>
          <Textarea
            id="message"
            name="message"
            value={campaign.message}
            onChange={handleInputChange}
            required
            className="dark:text-black"
          />
        </div>
        <div>
          <Label htmlFor="status" className="dark:text-white">
            Status
          </Label>
          <Select
            id="status"
            name="status"
            value={campaign.status}
            onChange={handleInputChange}
            className="dark:text-black"
          >
            <option value="New">New</option>
            <option value="Active">Active</option>
            <option value="Paused">Paused</option>
            <option value="Completed">Completed</option>
          </Select>
        </div>
          <div className="flex justify-end space-x-4">        <Button type="button" variant="light" onClick={handleCancel}>            Cancel        </Button>
            <Button type="submit">Save Changes</Button>        <DialogTrigger asChild>
                <Button disabled={campaign.status === "Active" || campaign.status === "New"} type="button" >Send Campaign</Button>
            </DialogTrigger>
            <SelectLeadsDialog open={open} setOpen={setOpen} onSelect={handleSendCampaign} />
              Send Campaign
            </Button>

          </div>

          <SelectLeadsDialog
            open={isSelectLeadsDialogOpen}

      </form>
    </div>
  );
}