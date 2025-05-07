"use client";

import type {CardProps} from "@heroui/react";

import React from "react";
import {Icon} from "@iconify/react";
import {Card, CardBody, CardHeader} from "@heroui/react";

export type FeatureCardProps = CardProps & {
  title: string;
  descriptions: string[];
  icon: React.ReactNode;
};

const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  ({title, descriptions = [], icon, ...props}, ref) => {
    return (
      <Card ref={ref} className="bg-content2" shadow="none" {...props}>
        <CardHeader className="flex flex-col gap-2 px-4 pb-4 pt-6">
          {icon}
          <p className="text-medium text-content2-foreground">{title}</p>
        </CardHeader>
        <CardBody className="flex flex-col gap-2">
          {descriptions.map((description, index) => (
            <div
              key={index}
              className="flex min-h-[50px] rounded-medium bg-content3 px-3 py-2 text-content3-foreground"
            >
              <p className="text-small">{description}</p>
            </div>
          ))}
        </CardBody>
      </Card>
    );
  },
);


const featuresCategories = [
  {
    key: "examples",
    title: "Examples",
    icon: <Icon icon="solar:mask-happly-linear" width={40} />,
    descriptions: [
      "Explain quantum computing in simple terms",
      "Got any creative ideas for a 10 year old' birthday?",
      "How do I make an HTTP request in Javascript?",
    ],
  },
  {
    key: "capabilities",
    title: "Capabilities",
    icon: <Icon icon="solar:magic-stick-3-linear" width={40} />,
    descriptions: [
      "Remembers what user said earlier in the conversation",
      "Allows user to provide follow-up corrections",
      "Trained to decline inappropriate requests",
    ],
  },
  {
    key: "limitations",
    title: "Limitations",
    icon: <Icon icon="solar:shield-warning-outline" width={40} />,
    descriptions: [
      "May occasionally generate incorrect information",
      "May occasionally produce harmful instructions or biased information.",
      "Limited knowledge of world and events after April 2023",
    ],
  },
];

export default function Component() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {featuresCategories.map((category) => (
        <FeatureCard
          key={category.key}
          descriptions={category.descriptions}
          icon={category.icon}
          title={category.title}
        />
      ))}
    </div>
  );
}
