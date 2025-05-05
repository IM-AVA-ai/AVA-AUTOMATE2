import React from 'react';
import { Bot } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card'; // Assuming Card and CardContent are from your UI library

interface UseCaseCardProps {
  industry: string;
  description: string;
}

const UseCaseCard: React.FC<UseCaseCardProps> = ({ industry, description }) => {
  return (
    <Card className="bg-black border border-gray-800 overflow-hidden">
      <CardContent className="p-6">
        <div className="w-12 h-12 rounded-full bg-ava-darkpurple3/30 flex items-center justify-center mb-4">
          <Bot className="h-6 w-6 text-ava-purple5" />
        </div>
        <h4 className="text-xl font-normal mb-3">{industry}</h4>
        <p className="text-gray-400">{description}</p>
      </CardContent>
    </Card>
  );
};

export default UseCaseCard;