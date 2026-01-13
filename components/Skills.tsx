"use client";

import { motion } from "framer-motion";
import {
  Code,
  Database,
  Smartphone,
  Zap,
  Palette,
  Globe,
  GitBranch,
  Cloud,
} from "lucide-react";

const skillCategories = [
  {
    title: "Frontend",
    icon: Code,
    skills: ["React", "Next.js", "TypeScript", "HTML/CSS", "Tailwind CSS", "JavaScript"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Backend",
    icon: Database,
    skills: ["Node.js", "Express", "REST APIs", "GraphQL", "MongoDB", "PostgreSQL"],
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Mobile",
    icon: Smartphone,
    skills: ["Responsive Design", "PWA", "Mobile-First", "Cross-Browser"],
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Performance",
    icon: Zap,
    skills: ["Optimization", "SEO", "Core Web Vitals", "Lighthouse"],
    color: "from-yellow-500 to-orange-500",
  },
  {
    title: "Design",
    icon: Palette,
    skills: ["UI/UX", "Figma", "Prototyping", "Design Systems"],
    color: "from-pink-500 to-rose-500",
  },
  {
    title: "Tools",
    icon: GitBranch,
    skills: ["Git", "Docker", "CI/CD", "Testing", "Webpack", "Vite"],
    color: "from-indigo-500 to-blue-500",
  },
];

export default function Skills() {
  return (
    <section
      id="skills"
      className="py-20 bg-gradient-to-br from-gray-50 to-primary-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Skills & Expertise
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A comprehensive toolkit for building modern web applications
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${category.color} mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {category.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-primary-100 hover:text-primary-700 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md">
            <Globe className="w-5 h-5 text-primary-600" />
            <span className="text-gray-700 font-medium">
              Always learning and expanding my skill set
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

