import React from 'react';
import { ArrowRight } from "lucide-react"; // Assuming ArrowRight is used or might be needed
import { Button } from "@/landing-page(s)/components/ui/button"; // Assuming Button is used or might be needed
//import { Card, CardContent } from "@/components/ui/card"; // Assuming Card or CardContent is used or might be needed
import { Card, CardContent } from "@/landing-page(s)/components/ui/card"; // Assuming Card or CardContent is used or might be needed
import { Bot, MessageSquare, Zap, Users } from "lucide-react"; // Assuming these icons might be passed

interface FeatureItemEnhancedProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureItemEnhanced: React.FC<FeatureItemEnhancedProps> = ({ icon, title, description }) => {
  return (
    <div className="relative group">
      {/* Background decorative elements */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-ava-darkpurple4 to-ava-purple5 opacity-0 group-hover:opacity-20 rounded-lg blur transition duration-300"></div>
      <div className="absolute right-0 top-0 h-20 w-20 bg-ava-purple5/5 rounded-full -mr-10 -mt-10 blur-xl"></div>

      <div className="relative bg-black border border-gray-800 hover:border-ava-darkpurple4/50 p-6 rounded-lg transition-all duration-300 text-left">
        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-ava-darkpurple3/30 flex items-center justify-center group-hover:bg-ava-darkpurple4/40 transition-colors duration-300">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-normal mb-2 group-hover:text-ava-purple5 transition-colors duration-300">
              {title}
            </h3>
            <p className="text-gray-400">{description}</p>
          </div>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute bottom-0 right-0 w-8 h-8 overflow-hidden">
          <div className="absolute transform rotate-45 bg-ava-purple5/10 w-4 h-4 -bottom-2 -right-2"></div>
        </div>
      </div>
    </div>
  );
};

export default FeatureItemEnhanced;