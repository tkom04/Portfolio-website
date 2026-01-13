"use client";

import { motion } from "framer-motion";
import { User, Target, Heart } from "lucide-react";

export default function About() {
  return (
    <section
      id="about"
      className="py-20 bg-white"
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
            About Me
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Passionate web developer dedicated to creating exceptional digital experiences
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center p-6 rounded-lg bg-gradient-to-br from-primary-50 to-white"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <User className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Who I Am</h3>
            <p className="text-gray-600">
              A dedicated web developer with a passion for creating beautiful, functional websites
              that deliver real value to businesses and users alike.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center p-6 rounded-lg bg-gradient-to-br from-primary-50 to-white"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <Target className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">My Mission</h3>
            <p className="text-gray-600">
              To help businesses establish a strong online presence through modern, responsive,
              and performance-optimized web solutions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center p-6 rounded-lg bg-gradient-to-br from-primary-50 to-white"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <Heart className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">What I Love</h3>
            <p className="text-gray-600">
              I'm passionate about clean code, user experience, and staying up-to-date with
              the latest web technologies and best practices.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 max-w-3xl mx-auto"
        >
          <div className="bg-gradient-to-r from-primary-50 to-white p-8 rounded-lg border border-primary-100">
            <p className="text-lg text-gray-700 leading-relaxed text-center">
              With a focus on quality, performance, and user experience, I bring your vision to life
              through carefully crafted web solutions. Whether you need a simple landing page or a
              complex web application, I'm here to help you succeed online.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

