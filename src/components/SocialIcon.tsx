import React from 'react';
import { ArrowUpRight } from "lucide-react";

function SocialIcon() {
  return (
    <a
      href="#"
      className="w-8 h-8 rounded-full border border-gray-800 flex items-center justify-center text-gray-400 hover:text-ava-purple5 hover:border-ava-purple5 transition-colors"
    >
      <ArrowUpRight className="h-4 w-4" />
    </a>
  );
}

export default SocialIcon;