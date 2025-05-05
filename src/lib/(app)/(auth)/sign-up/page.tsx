import React from 'react';
import { GoogleOneTap, SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Sign Up</h1>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <SignUp />
        <GoogleOneTap />
      </div>
    </div>
  );
}
