"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronUp, Flashlight, Camera, MessageCircle } from "lucide-react";

interface LockScreenProps {
  unlockPhone: () => void;
  openContactFromNotification: () => void;
  isAnimating: boolean;
}

export default function LockScreen({ unlockPhone, openContactFromNotification, isAnimating }: LockScreenProps) {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [startY, setStartY] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationPressed, setNotificationPressed] = useState(false);
  const lockScreenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: false,
        })
      );
      setCurrentDate(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })
      );
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Show iMessage notification after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const diff = startY - currentY;
    if (diff > 0) {
      setDragY(diff);
    }
  };

  const handleTouchEnd = () => {
    if (dragY > 100) {
      unlockPhone();
    }
    setIsDragging(false);
    setDragY(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = startY - e.clientY;
    if (diff > 0) {
      setDragY(diff);
    }
  };

  const handleMouseUp = () => {
    if (dragY > 100) {
      unlockPhone();
    }
    setIsDragging(false);
    setDragY(0);
  };

  return (
    <div
      ref={lockScreenRef}
      className={`w-full h-full bg-cover bg-center relative transition-all duration-500 overflow-hidden ${
        isAnimating ? "scale-110 opacity-0" : "scale-100 opacity-100"
      }`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 1000' preserveAspectRatio='xMidYMid slice'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23002c5f;stop-opacity:1'/%3E%3Cstop offset='50%25' style='stop-color:%23001a3d;stop-opacity:1'/%3E%3Cstop offset='100%25' style='stop-color:%23000814;stop-opacity:1'/%3E%3C/linearGradient%3E%3CradialGradient id='sphere1' cx='70%25' cy='25%25'%3E%3Cstop offset='0%25' style='stop-color:%2388b4f0;stop-opacity:1'/%3E%3Cstop offset='40%25' style='stop-color:%235a7ec4;stop-opacity:0.8'/%3E%3Cstop offset='100%25' style='stop-color:%23334d7a;stop-opacity:0'/%3E%3C/radialGradient%3E%3CradialGradient id='sphere2' cx='20%25' cy='70%25'%3E%3Cstop offset='0%25' style='stop-color:%2350c9bd;stop-opacity:1'/%3E%3Cstop offset='40%25' style='stop-color:%2338a193;stop-opacity:0.8'/%3E%3Cstop offset='100%25' style='stop-color:%23266b63;stop-opacity:0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='400' height='1000' fill='url(%23bg)'/%3E%3Cellipse cx='280' cy='220' rx='240' ry='380' fill='url(%23sphere1)' opacity='0.85'/%3E%3Cellipse cx='80' cy='650' rx='240' ry='340' fill='url(%23sphere2)' opacity='0.75'/%3E%3C/svg%3E")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Status Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 h-12">
        <div className="flex justify-between items-center px-8 pt-3 text-white text-sm font-semibold drop-shadow-lg">
          <span>{currentTime}</span>
          <div className="hidden md:block w-24 h-6 bg-black rounded-full" />
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-xs">100%</span>
          </div>
        </div>
      </div>

      {/* Clock Display */}
      <div className="absolute top-[18%] left-0 right-0 text-center px-6">
        <div 
          className="text-white text-[17px] drop-shadow-lg tracking-tight mb-2"
          style={{ 
            fontFamily: "'SF Pro Display', -apple-system, system-ui, sans-serif",
            fontWeight: 600 
          }}
        >
          {currentDate}
        </div>
        <div
          className="text-white text-[88px] drop-shadow-2xl tracking-tight leading-none"
          style={{ 
            fontFamily: "'SF Pro Display', -apple-system, system-ui, sans-serif",
            fontWeight: 200 
          }}
        >
          {currentTime}
        </div>
      </div>

      {/* iMessage Notification - Below Clock */}
      {showNotification && (
        <button
          onClick={openContactFromNotification}
          onMouseDown={() => setNotificationPressed(true)}
          onMouseUp={() => setNotificationPressed(false)}
          onMouseLeave={() => setNotificationPressed(false)}
          onTouchStart={() => setNotificationPressed(true)}
          onTouchEnd={() => setNotificationPressed(false)}
          className="absolute top-[42%] left-3 right-3 z-40 text-left cursor-pointer"
          style={{ 
            transform: `translateY(-${dragY * 0.3}px)`, 
            opacity: 1 - dragY / 250,
            animation: "slideDownNotification 0.5s ease-out"
          }}
        >
          <div 
            className={`bg-white/95 backdrop-blur-xl rounded-[20px] shadow-2xl transition-transform duration-100 ${
              notificationPressed ? "scale-95" : "scale-100"
            }`}
          >
            <div className="flex items-start gap-3 p-3">
              {/* iMessage Icon */}
              <div className="w-10 h-10 rounded-[10px] bg-[#00D856] flex items-center justify-center flex-shrink-0 shadow-md relative">
                {/* Speech bubble shape */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M12 2C6.48 2 2 6.03 2 11c0 2.25.92 4.3 2.42 5.86-.15.51-.37 1.39-.65 2.14-.09.25.05.52.3.59.06.02.12.03.18.03.19 0 .37-.11.45-.29.47-.91 1.07-2.09 1.45-2.84C7.26 17.45 9.54 18 12 18c5.52 0 10-4.03 10-9S17.52 2 12 2z" fill="white"/>
                </svg>
              </div>
              
              <div className="flex-1 min-w-0 pr-2">
                {/* Header */}
                <div className="flex items-baseline justify-between mb-0.5">
                  <span className="text-[13px] font-semibold text-gray-900">Messages</span>
                  <span className="text-[11px] text-gray-500 ml-2">now</span>
                </div>
                
                {/* Phone Number */}
                <div className="text-[13px] font-semibold text-gray-900 mb-1">
                  07506 902372
                </div>
                
                {/* Message */}
                <div className="text-[13px] text-gray-900 leading-[1.3] line-clamp-2">
                  Hi! I'm Rhys, welcome to my portfolio. My number is above but you can get it again shortly
                </div>
              </div>
            </div>
          </div>
        </button>
      )}

      <style jsx>{`
        @keyframes slideDownNotification {
          from {
            transform: translateY(-120px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>

      {/* Swipe Up Indicator */}
      <div
        className="absolute bottom-28 left-0 right-0 flex flex-col items-center gap-2 transition-all duration-300"
        style={{
          transform: `translateY(-${dragY}px)`,
          opacity: 1 - dragY / 150,
        }}
      >
        <ChevronUp className="text-white animate-bounce drop-shadow-lg" size={28} strokeWidth={3} />
      </div>

      {/* Bottom Quick Actions */}
      <div className="absolute left-10 right-10 flex justify-between" style={{ bottom: 'max(40px, calc(env(safe-area-inset-bottom) + 24px))' }}>
        <button className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-2xl flex items-center justify-center shadow-xl active:scale-95 transition-transform">
          <Flashlight className="text-white" size={22} strokeWidth={2.5} />
        </button>
        <button className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-2xl flex items-center justify-center shadow-xl active:scale-95 transition-transform">
          <Camera className="text-white" size={22} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

