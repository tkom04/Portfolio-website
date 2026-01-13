"use client";

import AppContainer from "../AppContainer";
import { ExternalLink, Github } from "lucide-react";

interface WorkAppProps {
  closeApp: () => void;
  isAnimating: boolean;
}

export default function WorkApp({ closeApp, isAnimating }: WorkAppProps) {
  const projects = [
    {
      title: "E-Commerce Platform",
      description: "Full-stack online store with payment integration and admin dashboard",
      tags: ["Next.js", "Stripe", "MongoDB"],
      gradient: "from-blue-400 to-cyan-500",
    },
    {
      title: "SaaS Dashboard",
      description: "Analytics platform with real-time data visualization",
      tags: ["React", "TypeScript", "Firebase"],
      gradient: "from-purple-400 to-pink-500",
    },
    {
      title: "Portfolio Website",
      description: "Modern, responsive portfolio with smooth animations",
      tags: ["Next.js", "Framer Motion", "Tailwind"],
      gradient: "from-green-400 to-emerald-500",
    },
    {
      title: "Task Manager",
      description: "Collaborative task management with real-time updates",
      tags: ["React", "Node.js", "Socket.io"],
      gradient: "from-orange-400 to-red-500",
    },
    {
      title: "Landing Page",
      description: "Conversion-optimized landing page for SaaS product",
      tags: ["Next.js", "Tailwind CSS"],
      gradient: "from-indigo-400 to-blue-500",
    },
    {
      title: "API Platform",
      description: "RESTful API with comprehensive documentation",
      tags: ["Node.js", "Express", "PostgreSQL"],
      gradient: "from-pink-400 to-rose-500",
    },
  ];

  return (
    <AppContainer
      title="My Work"
      closeApp={closeApp}
      isAnimating={isAnimating}
      headerColor="bg-gradient-to-br from-purple-400 to-purple-600"
    >
      <div className="p-6 space-y-4">
        <p className="text-gray-600 mb-6">
          A selection of projects showcasing my skills and expertise
        </p>

        {projects.map((project, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl shadow-lg overflow-hidden"
            style={{
              animation: `slideInUp 0.4s ease-out ${index * 0.1}s both`,
            }}
          >
            <div className={`h-32 bg-gradient-to-br ${project.gradient} relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center hover:bg-white/50 transition-colors">
                  <ExternalLink size={16} className="text-white" />
                </button>
                <button className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center hover:bg-white/50 transition-colors">
                  <Github size={16} className="text-white" />
                </button>
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {project.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </AppContainer>
  );
}

