import { Sidebar } from '@/components/Sidebar'; // Import the Sidebar component

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar /> {/* Uncomment and render the Sidebar component */}
      <main className="pb-6">
        {children}
      </main>
    </>
  );
}
