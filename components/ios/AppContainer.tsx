"use client";

import { ChevronLeft } from "lucide-react";
import { ReactNode } from "react";

interface AppContainerProps {
  title: string;
  closeApp: () => void;
  isAnimating: boolean;
  children: ReactNode;
  headerColor?: string;
}

export default function AppContainer({
  title,
  closeApp,
  isAnimating,
  children,
  headerColor = "bg-gradient-to-br from-blue-500 to-purple-600",
}: AppContainerProps) {
  return (
    <div
      className={`w-full h-full bg-white transition-all duration-300 ${
        isAnimating ? "scale-95 opacity-0" : "scale-100 opacity-100"
      }`}
      style={{
        animation: isAnimating ? "none" : "slideInApp 0.4s ease-out",
      }}
    >
      {/* App Header */}
      <div className={`${headerColor} text-white px-4 py-4 shadow-lg`}>
        <div className="flex items-center gap-3">
          <button
            onClick={closeApp}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors active:scale-95"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
      </div>

      {/* App Content */}
      <div className="h-[calc(100%-72px)] overflow-y-auto overflow-x-hidden">{children}</div>

      <style jsx>{`
        @keyframes slideInApp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

