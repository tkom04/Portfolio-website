"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Sarah Johnson",
    role: "CEO, TechStart Inc.",
    content:
      "Working with this developer was an absolute pleasure. They delivered a beautiful, high-performance website that exceeded our expectations. Professional, responsive, and incredibly skilled.",
    rating: 5,
    project: "Corporate Website Redesign",
  },
  {
    name: "Michael Chen",
    role: "Founder, E-Commerce Solutions",
    content:
      "The e-commerce platform they built for us has been a game-changer. Clean code, excellent documentation, and ongoing support. Highly recommend for any web development needs.",
    rating: 5,
    project: "E-Commerce Platform",
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Director, Creative Agency",
    content:
      "Outstanding work! They transformed our vision into reality with attention to detail and creative solutions. The website is fast, modern, and perfectly aligned with our brand.",
    rating: 5,
    project: "Portfolio Website",
  },
  {
    name: "David Thompson",
    role: "Product Manager, SaaS Company",
    content:
      "Professional, reliable, and technically excellent. They built our dashboard with complex features and delivered on time. The code quality is top-notch and maintainable.",
    rating: 5,
    project: "SaaS Dashboard",
  },
  {
    name: "Lisa Anderson",
    role: "Small Business Owner",
    content:
      "As a small business owner, I needed someone who could understand my needs and deliver quality work within budget. They did exactly that and more. Very satisfied!",
    rating: 5,
    project: "Business Website",
  },
  {
    name: "James Wilson",
    role: "Startup Founder",
    content:
      "Fast turnaround, great communication, and exceptional results. They helped us launch our MVP quickly without compromising on quality. Will definitely work with them again.",
    rating: 5,
    project: "MVP Development",
  },
];

export default function Reviews() {
  return (
    <section
      id="reviews"
      className="py-20 bg-gradient-to-br from-primary-50 to-white"
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
            Client Reviews
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            What clients say about working with me
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100 relative"
            >
              <Quote className="w-8 h-8 text-primary-200 absolute top-4 right-4" />
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed relative z-10">
                "{review.content}"
              </p>
              <div className="border-t border-gray-100 pt-4">
                <p className="font-semibold text-gray-900">{review.name}</p>
                <p className="text-sm text-gray-600">{review.role}</p>
                <p className="text-xs text-primary-600 mt-1">{review.project}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-block bg-white px-8 py-6 rounded-lg shadow-md border border-gray-100">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-3xl font-bold text-gray-900">5.0</span>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-600">
              Average rating from <span className="font-semibold">{reviews.length}</span> clients
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

