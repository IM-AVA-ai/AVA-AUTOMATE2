// src/app/layout.tsx


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* <sidebar /> */}
      <main className="pb-6">
        {children}
      </main>
    </>
  );
}
