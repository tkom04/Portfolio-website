"use client";

import AppContainer from "../AppContainer";
import { Star, Quote } from "lucide-react";

interface ReviewsAppProps {
  closeApp: () => void;
  isAnimating: boolean;
}

export default function ReviewsApp({ closeApp, isAnimating }: ReviewsAppProps) {
  const reviews = [
    {
      name: "Sarah Johnson",
      role: "CEO, TechStart Inc.",
      content:
        "Exceptional work! The website exceeded our expectations. Professional, responsive, and incredibly skilled.",
      rating: 5,
      avatar: "SJ",
      color: "from-blue-400 to-blue-600",
    },
    {
      name: "Michael Chen",
      role: "Founder, E-Commerce Co.",
      content:
        "The platform they built has been a game-changer. Clean code, excellent documentation, and ongoing support.",
      rating: 5,
      avatar: "MC",
      color: "from-purple-400 to-purple-600",
    },
    {
      name: "Emily Rodriguez",
      role: "Marketing Director",
      content:
        "Outstanding! They transformed our vision into reality with attention to detail and creative solutions.",
      rating: 5,
      avatar: "ER",
      color: "from-pink-400 to-pink-600",
    },
    {
      name: "David Thompson",
      role: "Product Manager",
      content:
        "Professional and technically excellent. Delivered on time with top-notch code quality.",
      rating: 5,
      avatar: "DT",
      color: "from-green-400 to-green-600",
    },
    {
      name: "Lisa Anderson",
      role: "Small Business Owner",
      content:
        "As a small business owner, I needed quality work within budget. They delivered exactly that and more!",
      rating: 5,
      avatar: "LA",
      color: "from-orange-400 to-orange-600",
    },
  ];

  return (
    <AppContainer
      title="Reviews"
      closeApp={closeApp}
      isAnimating={isAnimating}
      headerColor="bg-gradient-to-br from-yellow-400 to-orange-500"
    >
      <div className="p-6 space-y-6">
        {/* Rating Summary */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-6 shadow-sm text-center">
          <div className="text-5xl font-bold text-gray-900 mb-2">5.0</div>
          <div className="flex justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-gray-600">
            Based on <span className="font-semibold">{reviews.length}</span> reviews
          </p>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-5 shadow-md"
              style={{
                animation: `slideInRight 0.4s ease-out ${index * 0.1}s both`,
              }}
            >
              <div className="flex items-start gap-4 mb-3">
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${review.color} flex items-center justify-center text-white font-bold flex-shrink-0`}
                >
                  {review.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900">{review.name}</h4>
                  <p className="text-sm text-gray-600">{review.role}</p>
                </div>
                <Quote className="w-6 h-6 text-gray-300 flex-shrink-0" />
              </div>
              <div className="flex gap-1 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                "{review.content}"
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-6 shadow-sm text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Want to work together?
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Join these satisfied clients and let's create something amazing!
          </p>
          <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-2xl hover:shadow-lg transition-all active:scale-95">
            Get in Touch
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </AppContainer>
  );
}

