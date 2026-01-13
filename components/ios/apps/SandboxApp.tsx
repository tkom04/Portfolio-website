"use client";

import AppContainer from "../AppContainer";
import { Play, Code2, Sparkles, Lightbulb } from "lucide-react";

interface SandboxAppProps {
  closeApp: () => void;
  isAnimating: boolean;
}

export default function SandboxApp({ closeApp, isAnimating }: SandboxAppProps) {
  const experiments = [
    {
      title: "WebGL Shader Art",
      description: "Interactive shader experiments with Three.js",
      icon: Sparkles,
      color: "from-purple-400 to-pink-500",
    },
    {
      title: "CSS Animations",
      description: "Creative animations using pure CSS",
      icon: Code2,
      color: "from-blue-400 to-cyan-500",
    },
    {
      title: "React Components",
      description: "Reusable component library showcase",
      icon: Play,
      color: "from-green-400 to-emerald-500",
    },
    {
      title: "3D Interactions",
      description: "Interactive 3D models and scenes",
      icon: Sparkles,
      color: "from-orange-400 to-red-500",
    },
    {
      title: "Data Visualizations",
      description: "Dynamic charts and graphs",
      icon: Code2,
      color: "from-indigo-400 to-purple-500",
    },
    {
      title: "Micro-interactions",
      description: "Delightful UI micro-interactions",
      icon: Play,
      color: "from-pink-400 to-rose-500",
    },
  ];

  return (
    <AppContainer
      title="Sandbox"
      closeApp={closeApp}
      isAnimating={isAnimating}
      headerColor="bg-gradient-to-br from-green-400 to-green-600"
    >
      <div className="p-6 space-y-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            🧪 Experimental Lab
          </h3>
          <p className="text-gray-700">
            A collection of experiments, demos, and creative coding projects.
            This is where I test new ideas and push the boundaries of web technology.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {experiments.map((experiment, index) => {
            const Icon = experiment.icon;
            return (
              <button
                key={index}
                className="bg-white rounded-3xl p-5 shadow-md hover:shadow-xl transition-all active:scale-95"
                style={{
                  animation: `popIn 0.4s ease-out ${index * 0.1}s both`,
                }}
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${experiment.color} flex items-center justify-center mb-3 mx-auto`}
                >
                  <Icon className="text-white" size={32} />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1 text-center">
                  {experiment.title}
                </h4>
                <p className="text-xs text-gray-600 text-center">
                  {experiment.description}
                </p>
              </button>
            );
          })}
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-6 shadow-sm border-2 border-yellow-200">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">
                Always Experimenting
              </h4>
              <p className="text-sm text-gray-700">
                New demos and experiments are added regularly. Check back often to see what's new!
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </AppContainer>
  );
}

