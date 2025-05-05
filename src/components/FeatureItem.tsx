// src/components/FeatureItem.tsx
import React from 'react';

function FeatureItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-ava-darkpurple3/30 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-normal mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
}

export default FeatureItem;