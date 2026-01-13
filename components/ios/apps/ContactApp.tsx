"use client";

import AppContainer from "../AppContainer";
import { Mail, Phone, MapPin, Linkedin, Github, Send } from "lucide-react";
import { useState } from "react";

interface ContactAppProps {
  closeApp: () => void;
  isAnimating: boolean;
}

export default function ContactApp({ closeApp, isAnimating }: ContactAppProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message sent! (This is a demo)");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <AppContainer
      title="Contact"
      closeApp={closeApp}
      isAnimating={isAnimating}
      headerColor="bg-gradient-to-br from-cyan-400 to-blue-500"
    >
      <div className="p-6 space-y-6">
        {/* Contact Info Cards */}
        <div className="space-y-3">
          <a
            href="mailto:Hello@orbit.tech"
            className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center flex-shrink-0">
              <Mail className="text-white" size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-500 mb-1">Email</div>
              <div className="font-semibold text-gray-900 truncate">
                Hello@orbit.tech
              </div>
            </div>
          </a>

          <a
            href="tel:07506902372"
            className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
              <Phone className="text-white" size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-500 mb-1">Phone</div>
              <div className="font-semibold text-gray-900">07506 902372</div>
            </div>
          </a>

          <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-md">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center flex-shrink-0">
              <MapPin className="text-white" size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-500 mb-1">Location</div>
              <div className="font-semibold text-gray-900">
                Based in Maidstone, Kent
              </div>
              <div className="text-xs text-gray-600 mt-0.5">
                Available globally
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-3 px-1">
            CONNECT WITH ME
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <a
              href="https://www.linkedin.com/in/rhys-bone-6b957b168/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <Linkedin className="text-white" size={24} />
              </div>
              <span className="text-xs font-medium text-gray-700">LinkedIn</span>
            </a>
            <a
              href="https://github.com/tkom04"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                <Github className="text-white" size={24} />
              </div>
              <span className="text-xs font-medium text-gray-700">GitHub</span>
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-3 px-1">
            SEND A MESSAGE
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="w-full px-4 py-3 bg-white rounded-2xl shadow-sm border-2 border-transparent focus:border-cyan-400 outline-none transition-all"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="w-full px-4 py-3 bg-white rounded-2xl shadow-sm border-2 border-transparent focus:border-cyan-400 outline-none transition-all"
            />
            <textarea
              placeholder="Your Message"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              required
              rows={4}
              className="w-full px-4 py-3 bg-white rounded-2xl shadow-sm border-2 border-transparent focus:border-cyan-400 outline-none transition-all resize-none"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Send size={20} />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </AppContainer>
  );
}

