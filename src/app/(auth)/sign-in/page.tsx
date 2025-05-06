import React from 'react';
import { GoogleOneTap, SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Sign In</h1>
      <div className="mb-4">
        <SignIn />
        <GoogleOneTap />
      </div>
    </div>

  .dark {
    --background: 0 0% 0%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3%;
    --popover-foreground: 0 0% 98%;
    --primary: 273 68% 59%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 8%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 273 68% 59%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 273 68% 59%;
  }
  );
}
