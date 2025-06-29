"use client";

import { motion } from "framer-motion";
import {
  MessageCircle,
  Video,
  Users,
  TrendingUp,
  Mic,
  Brain,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const FeaturesSection = () => {
  const mainFeatures = [
    {
      icon: MessageCircle,
      title: "Real people",
      description:
        "Converse with native speakers and fellow learners in authentic conversations that matter",
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: Brain,
      title: "Real support",
      description:
        "Get personalized feedback and guidance from AI tutors trained by language experts",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Users,
      title: "Real-life skills",
      description:
        "Practice scenarios you'll actually use in work, travel, and daily conversations",
      color: "bg-green-100 text-green-600",
    },
  ];

  const whyFluentzy = [
    {
      icon: "🎯",
      title: "Expert-designed lessons",
      description: "Built by linguists and language teachers",
    },
    {
      icon: "🗣️",
      title: "Build speaking confidence",
      description: "Practice speaking from day one",
    },
    {
      icon: "📝",
      title: "Track your progress",
      description: "See your improvement with detailed analytics",
    },
    {
      icon: "💬",
      title: "Connect with Community",
      description: "Learn alongside millions of other learners",
    },
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-6">
        {/* Learn real-world skills */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Learn real-world language skills
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Practice the language you'll actually use in everyday situations
          </p>
        </motion.div>

        {/* User success stories */}
        <div className="grid md:grid-cols-4 gap-6 mb-20">
          {[
            {
              name: "Sarah",
              role: "Business Professional",
              image: "👩‍💼",
              story: "Aced my Spanish presentation!",
            },
            {
              name: "Marcus",
              role: "Travel Enthusiast",
              image: "🧳",
              story: "Ordered food in 5 countries!",
            },
            {
              name: "Lisa",
              role: "Student",
              image: "👩‍🎓",
              story: "Passed my French exam!",
            },
            {
              name: "David",
              role: "Entrepreneur",
              image: "👨‍💼",
              story: "Expanded business to Italy!",
            },
          ].map((user, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="text-center p-6 hover:shadow-lg transition-all">
                <CardContent className="p-0">
                  <div className="text-6xl mb-4">{user.image}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {user.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{user.role}</p>
                  <p className="text-sm text-blue-600 font-medium italic">
                    "{user.story}"
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* What makes Fluentzy different */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-12">
            What makes Fluentzy different?
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {mainFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="text-center p-8 h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div
                    className={`w-20 h-20 rounded-full ${feature.color} flex items-center justify-center mx-auto mb-6`}
                  >
                    <feature.icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Why learn with Fluentzy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-12 text-white"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Why learn a language with Fluentzy?
            </h2>
            <p className="text-xl text-blue-100">
              Join millions who chose the smarter way to learn
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyFluentzy.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-blue-100 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
