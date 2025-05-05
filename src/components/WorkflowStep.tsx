import React from 'react';

interface WorkflowStepProps {
  number: string;
  title: string;
  description: string;
}

function WorkflowStep({ number, title, description }: WorkflowStepProps) {
  return (
    <div className="bg-black border border-gray-800 rounded-lg p-6 text-center">
      <div className="w-12 h-12 rounded-full bg-ava-darkpurple3/30 flex items-center justify-center mx-auto mb-4">
        <span className="text-ava-purple5 font-normal">{number}</span>
      </div>
      <h3 className="text-xl font-normal mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

export default WorkflowStep;