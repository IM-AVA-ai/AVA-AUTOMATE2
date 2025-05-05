import React from 'react';
import { Card, CardContent } from '@/components/ui/card'; // Assuming Card and CardContent are in this path

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <Card className="bg-black border border-gray-800 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-ava-darkpurple3/30 mr-4 flex items-center justify-center">
            {icon}
          </div>
          <h3 className="text-xl font-normal">{title}</h3>
        </div>
        <p className="text-gray-400">{description}</p>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;