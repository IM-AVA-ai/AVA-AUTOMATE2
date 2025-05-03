import { Conversation, getRecentConversations } from '@/services/conversations';
import { currentUser } from '@clerk/nextjs/server';
import { getCampaigns } from '@/services/campaigns';
import { getLeads } from '@/services/leads';
import DashboardContent from '@/components/DashboardContent';

export default async function DashboardPage() {
  const user = await currentUser();
  console.log('Current user:', user); // Log user
  if (!user) return null;
  const userId = user.id;
  const recentConversations: Conversation[] = await getRecentConversations(userId);
  const campaigns = await getCampaigns(userId);
  const leads = await getLeads(userId);
  console.log('Recent conversations:', recentConversations); // Log data
  console.log('Campaigns:', campaigns); // Log data
  console.log('Leads:', leads); // Log data

  return (
    <DashboardContent
      recentConversations={recentConversations}
      campaigns={campaigns}
      leads={leads}
    />
  );
}
