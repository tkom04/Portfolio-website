"use client";

import { User, Briefcase, Code, Star, Wrench, Mail, Phone } from "lucide-react";
import AppIcon from "./AppIcon";
import { AppType } from "@/app/ios/page";

interface HomeScreenProps {
  openApp: (app: AppType) => void;
  lockPhone: () => void;
  isAnimating: boolean;
}

export default function HomeScreen({ openApp, lockPhone, isAnimating }: HomeScreenProps) {
  const apps = [
    {
      id: "about" as AppType,
      name: "About",
      icon: User,
      gradient: "from-blue-400 to-blue-600",
      description: "Learn about me",
    },
    {
      id: "work" as AppType,
      name: "My Work",
      icon: Briefcase,
      gradient: "from-purple-400 to-purple-600",
      description: "Portfolio & projects",
    },
    {
      id: "sandbox" as AppType,
      name: "Sandbox",
      icon: Code,
      gradient: "from-green-400 to-green-600",
      description: "Experiments & demos",
    },
    {
      id: "reviews" as AppType,
      name: "Reviews",
      icon: Star,
      gradient: "from-yellow-400 to-orange-500",
      description: "Client testimonials",
    },
    {
      id: "skills" as AppType,
      name: "Skills",
      icon: Wrench,
      gradient: "from-red-400 to-pink-600",
      description: "Tech stack",
    },
    {
      id: "contact" as AppType,
      name: "Contact",
      icon: Mail,
      gradient: "from-cyan-400 to-blue-500",
      description: "Get in touch",
    },
  ];

  return (
    <div
      className={`w-full h-full bg-cover bg-center transition-all duration-300 overflow-hidden ${
        isAnimating ? "scale-110 opacity-0" : "scale-100 opacity-100"
      }`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 1000' preserveAspectRatio='xMidYMid slice'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23002c5f;stop-opacity:1'/%3E%3Cstop offset='50%25' style='stop-color:%23001a3d;stop-opacity:1'/%3E%3Cstop offset='100%25' style='stop-color:%23000814;stop-opacity:1'/%3E%3C/linearGradient%3E%3CradialGradient id='sphere1' cx='70%25' cy='25%25'%3E%3Cstop offset='0%25' style='stop-color:%2388b4f0;stop-opacity:1'/%3E%3Cstop offset='40%25' style='stop-color:%235a7ec4;stop-opacity:0.8'/%3E%3Cstop offset='100%25' style='stop-color:%23334d7a;stop-opacity:0'/%3E%3C/radialGradient%3E%3CradialGradient id='sphere2' cx='20%25' cy='70%25'%3E%3Cstop offset='0%25' style='stop-color:%2350c9bd;stop-opacity:1'/%3E%3Cstop offset='40%25' style='stop-color:%2338a193;stop-opacity:0.8'/%3E%3Cstop offset='100%25' style='stop-color:%23266b63;stop-opacity:0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='400' height='1000' fill='url(%23bg)'/%3E%3Cellipse cx='280' cy='220' rx='240' ry='380' fill='url(%23sphere1)' opacity='0.85'/%3E%3Cellipse cx='80' cy='650' rx='240' ry='340' fill='url(%23sphere2)' opacity='0.75'/%3E%3C/svg%3E")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Wallpaper overlay for depth */}
      <div className="absolute inset-0 bg-black/5" />

      {/* App Grid */}
      <div className="relative z-10 px-6 pt-20 pb-32">
        <div className="grid grid-cols-4 gap-5 mb-8">
          {apps.map((app, index) => (
            <AppIcon
              key={app.id}
              app={app}
              onOpen={() => openApp(app.id)}
              delay={index * 50}
            />
          ))}
        </div>

        {/* Page Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          <div className="w-2 h-2 rounded-full bg-white shadow-lg" />
          <div className="w-2 h-2 rounded-full bg-white/30" />
        </div>
      </div>

      {/* Dock */}
      <div className="absolute left-4 right-4 z-20" style={{ bottom: 'max(24px, calc(env(safe-area-inset-bottom) + 8px))' }}>
        <div className="bg-white/15 backdrop-blur-3xl rounded-[32px] p-3 shadow-2xl">
          <div className="flex justify-around items-center">
            {/* Phone - Green iOS style */}
            <a
              href="tel:07506902372"
              className="w-14 h-14 rounded-2xl bg-[#00D856] flex items-center justify-center text-white shadow-lg transform active:scale-95 transition-transform"
            >
              <Phone size={28} strokeWidth={2.5} />
            </a>
            
            {/* Mail - Blue iOS style */}
            <a
              href="mailto:Hello@orbit.tech"
              className="w-14 h-14 rounded-2xl bg-[#007AFF] flex items-center justify-center text-white shadow-lg transform active:scale-95 transition-transform"
            >
              <Mail size={28} strokeWidth={2.5} />
            </a>
            
            {/* GitHub */}
            <a
              href="https://github.com/tkom04"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white shadow-lg transform active:scale-95 transition-transform"
            >
              <Code size={28} strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </div>

      {/* Lock button (top left widget area) */}
      <button
        onClick={lockPhone}
        className="absolute top-16 left-6 w-[72px] h-[72px] rounded-2xl bg-white/10 backdrop-blur-2xl flex items-center justify-center shadow-xl hover:bg-white/15 transition-all active:scale-95"
      >
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </button>
    </div>
  );
}

