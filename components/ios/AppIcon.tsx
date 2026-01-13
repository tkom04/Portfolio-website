"use client";

import { LucideIcon } from "lucide-react";
import { useState } from "react";

interface AppIconProps {
  app: {
    id: string;
    name: string;
    icon: LucideIcon;
    gradient: string;
    description: string;
  };
  onOpen: () => void;
  delay?: number;
}

export default function AppIcon({ app, onOpen, delay = 0 }: AppIconProps) {
  const [isPressed, setIsPressed] = useState(false);
  const Icon = app.icon;

  return (
    <button
      onClick={onOpen}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className="flex flex-col items-center gap-2 group"
      style={{
        animation: `fadeInScale 0.4s ease-out ${delay}ms both`,
      }}
    >
      <div
        className={`w-[68px] h-[68px] rounded-[18px] bg-gradient-to-br ${app.gradient} flex items-center justify-center text-white shadow-xl transform transition-all duration-150 ${
          isPressed ? "scale-90" : "scale-100 group-hover:scale-105"
        }`}
      >
        <Icon size={36} strokeWidth={2.5} />
      </div>
      <span className="text-white text-[11px] font-medium drop-shadow-lg text-center leading-tight tracking-tight">
        {app.name}
      </span>

      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </button>
  );
}

