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
  );
}
