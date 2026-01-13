"use client";

import AppContainer from "../AppContainer";

interface SkillsAppProps {
  closeApp: () => void;
  isAnimating: boolean;
}

export default function SkillsApp({ closeApp, isAnimating }: SkillsAppProps) {
  const skillCategories = [
    {
      category: "Frontend",
      color: "from-blue-400 to-cyan-500",
      skills: [
        { name: "React", level: 95 },
        { name: "Next.js", level: 90 },
        { name: "TypeScript", level: 88 },
        { name: "Tailwind CSS", level: 92 },
      ],
    },
    {
      category: "Backend",
      color: "from-green-400 to-emerald-500",
      skills: [
        { name: "Node.js", level: 85 },
        { name: "Express", level: 82 },
        { name: "MongoDB", level: 80 },
        { name: "PostgreSQL", level: 78 },
      ],
    },
    {
      category: "Tools & Others",
      color: "from-purple-400 to-pink-500",
      skills: [
        { name: "Git", level: 90 },
        { name: "Docker", level: 75 },
        { name: "Figma", level: 85 },
        { name: "WebGL", level: 70 },
      ],
    },
  ];

  return (
    <AppContainer
      title="Skills"
      closeApp={closeApp}
      isAnimating={isAnimating}
      headerColor="bg-gradient-to-br from-red-400 to-pink-600"
    >
      <div className="p-6 space-y-6">
        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-3xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            💪 Tech Stack
          </h3>
          <p className="text-gray-700">
            A comprehensive toolkit for building modern web applications
          </p>
        </div>

        {skillCategories.map((category, catIndex) => (
          <div
            key={catIndex}
            className="space-y-4"
            style={{
              animation: `fadeInUp 0.4s ease-out ${catIndex * 0.2}s both`,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full bg-gradient-to-br ${category.color}`}
              />
              <h3 className="text-lg font-bold text-gray-900">
                {category.category}
              </h3>
            </div>

            <div className="space-y-3">
              {category.skills.map((skill, skillIndex) => (
                <div
                  key={skillIndex}
                  className="bg-white rounded-2xl p-4 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-900">
                      {skill.name}
                    </span>
                    <span className="text-sm font-medium text-gray-600">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${category.color} rounded-full transition-all duration-1000`}
                      style={{
                        width: `${skill.level}%`,
                        animation: `growWidth 1s ease-out ${
                          (catIndex * 0.2) + (skillIndex * 0.1)
                        }s both`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Additional Skills */}
        <div className="bg-white rounded-3xl p-6 shadow-md">
          <h4 className="font-bold text-gray-900 mb-4">Also Experienced With</h4>
          <div className="flex flex-wrap gap-2">
            {[
              "REST APIs",
              "GraphQL",
              "Redux",
              "Jest",
              "CI/CD",
              "AWS",
              "Vercel",
              "Firebase",
              "Framer Motion",
              "Three.js",
              "Socket.io",
              "Webpack",
            ].map((tech, index) => (
              <span
                key={index}
                className="px-3 py-2 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 rounded-xl text-sm font-medium"
                style={{
                  animation: `popIn 0.3s ease-out ${index * 0.05}s both`,
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes growWidth {
          from {
            width: 0%;
          }
        }
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

