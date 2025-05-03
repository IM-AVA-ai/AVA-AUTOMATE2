import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <h1>My App</h1>
      <p>Welcome</p>
      <p>Click the button below to go to the dashboard.</p>
      <Link href="/dashboard">Go to Dashboard</Link>
      <p>If you see this page, the root route is working. If clicking the button gives a 404, the issue is with the /dashboard route setup.</p>
      <div>
        {/* Assuming a sign-in button or component */}
        <Link href="/login">
          <button>Sign in</button>
        </Link>
      </div>
    </div>
  );
}
