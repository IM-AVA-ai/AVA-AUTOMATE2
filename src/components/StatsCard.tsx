import React from 'react';
import { Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: number;
  description?: string;
}

export const StatsCard = ({ title, value, icon, trend, description }: StatsCardProps) => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <Card 
      className="group bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl 
        border border-white/5 shadow-[0_4px_20px_-1px_rgba(0,0,0,0.3)]
        hover:shadow-[0_8px_40px_-1px_rgba(0,0,0,0.5)] hover:border-purple-500/20 
        transition-all duration-300 relative overflow-hidden"
      motionProps={{
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: "easeOut" },
        whileHover: { scale: 1.02 }
      }}
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent rounded-xl" />
      
      {/* Spotlight effect */}
      <div 
        className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500
          bg-[radial-gradient(600px_circle_at_var(--mouse-x)_var(--mouse-y),rgba(147,51,234,0.15),transparent_40%)]
          pointer-events-none"
        style={{
          '--mouse-x': `${mousePosition.x}px`,
          '--mouse-y': `${mousePosition.y}px`,
        } as React.CSSProperties}
      />
      
      <CardBody className="relative">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="space-y-2">
              <p className="text-white/50 text-sm tracking-wider font-normal">{title}</p>
              <h3 className="text-3xl text-white/95 font-normal tracking-wide drop-shadow-sm">
                {value}
              </h3>
            </div>
            {description && (
              <p className="text-white/40 text-xs tracking-wide font-normal">
                {description}
              </p>
            )}
            {trend && (
              <p className={`flex items-center gap-1.5 text-sm font-normal tracking-wide ${
                trend > 0 ? 'text-emerald-400/90' : 'text-red-400/90'
              }`}>
                <Icon icon={trend > 0 ? 'lucide:trending-up' : 'lucide:trending-down'} 
                  className="drop-shadow-sm" />
                {Math.abs(trend)}% {trend > 0 ? 'increase' : 'decrease'}
              </p>
            )}
          </div>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-black/70 to-black/50 
            backdrop-blur-md shadow-[inset_0_0_20px_rgba(147,51,234,0.1)] 
            ring-1 ring-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
            <Icon icon={icon} className="text-3xl text-white/80 relative drop-shadow-lg" />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};