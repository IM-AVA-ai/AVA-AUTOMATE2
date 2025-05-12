
import LeadsTableClient from '@/components/leads/LeadsTable';

// Server Component: fetch initial leads data here (replace with real fetch in production)

// Simulate server-side fetch (replace with real DB/API call)
async function fetchLeads(): Promise<Array<{ id: string; name: string; phone: string; status: string; added: string }>> {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 100));
  return [
    { id: '1', name: 'John Doe', phone: '+15551234567', status: 'New', added: '2024-07-28' },
    { id: '2', name: 'Jane Smith', phone: '+15559876543', status: 'Contacted', added: '2024-07-27' },
    { id: '3', name: 'Bob Johnson', phone: '+15551112233', status: 'Qualified', added: '2024-07-26' },
  ];
}

export default async function LeadsPage() {
  const initialLeads = await fetchLeads();
  return (
    <LeadsTableClient initialLeads={initialLeads} />
  );
}
