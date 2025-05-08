import { Sidebar } from '@/components/Sidebar'; // Import the Sidebar component
import { TopNav } from '@/components/TopNav'; // Import the TopNav component

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex row min-h-screen">
      <Sidebar /> {/* Uncomment and render the Sidebar component */}
      <main className="grow">
        <TopNav /> {/* Use the new TopNav */}
        <article className="overflow-auto p-8"> {/* Add padding to the main content */}
          {children}
        </article>
      </main>
    </div>
  );
}
