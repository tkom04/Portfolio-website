"use client";

import AppContainer from "../AppContainer";
import { User, Target, Heart, Award } from "lucide-react";

interface AboutAppProps {
  closeApp: () => void;
  isAnimating: boolean;
}

export default function AboutApp({ closeApp, isAnimating }: AboutAppProps) {
  return (
    <AppContainer
      title="About Me"
      closeApp={closeApp}
      isAnimating={isAnimating}
      headerColor="bg-gradient-to-br from-blue-400 to-blue-600"
    >
      <div className="p-6 space-y-6">
        {/* Profile Section */}
        <div className="text-center mb-8">
          <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white shadow-xl">
            <User size={64} strokeWidth={2} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Rhys Bone
          </h2>
          <p className="text-lg text-gray-600">Web Developer & Designer</p>
        </div>

        {/* Bio */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-3">Hello! 👋</h3>
          <p className="text-gray-700 leading-relaxed">
            I'm a passionate web developer dedicated to creating exceptional digital experiences.
            With a focus on modern technologies and user-centric design, I bring ideas to life
            through clean code and creative solutions.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-md text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">5+</div>
            <div className="text-xs text-gray-600">Years Exp</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">50+</div>
            <div className="text-xs text-gray-600">Projects</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md text-center">
            <div className="text-3xl font-bold text-pink-600 mb-1">30+</div>
            <div className="text-xs text-gray-600">Clients</div>
          </div>
        </div>

        {/* Values */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">What Drives Me</h3>
          
          <div className="bg-white rounded-2xl p-5 shadow-md">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Target className="text-blue-600" size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Mission-Driven</h4>
                <p className="text-sm text-gray-600">
                  Helping businesses establish strong online presence through modern web solutions.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-md">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Heart className="text-purple-600" size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Passionate</h4>
                <p className="text-sm text-gray-600">
                  I love clean code, great UX, and staying current with the latest web technologies.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-md">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center flex-shrink-0">
                <Award className="text-pink-600" size={24} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Quality-Focused</h4>
                <p className="text-sm text-gray-600">
                  Every project is crafted with attention to detail and commitment to excellence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppContainer>
  );
}

