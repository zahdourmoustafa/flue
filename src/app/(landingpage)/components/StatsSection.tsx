"use client";

import { motion } from "framer-motion";
import { Users, BookOpen, Globe } from "lucide-react";

export const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      number: "120",
      suffix: "million",
      description: "registered learners",
      color: "text-green-600",
    },
    {
      icon: BookOpen,
      number: "2,500+",
      suffix: "",
      description: "expertly-crafted lessons",
      color: "text-blue-600",
    },
    {
      icon: Globe,
      number: "76+ million",
      suffix: "",
      description: "conversations completed",
      color: "text-purple-600",
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${stat.color
                  .replace("text-", "bg-")
                  .replace("-600", "-100")} mb-4`}
              >
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>

              <motion.div
                initial={{ scale: 0.5 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                viewport={{ once: true }}
                className="mb-2"
              >
                <div className="text-4xl font-bold text-gray-900 mb-1">
                  {stat.number}
                  {stat.suffix && (
                    <span className="text-2xl ml-1">{stat.suffix}</span>
                  )}
                </div>
              </motion.div>

              <p className="text-gray-600 font-medium">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
