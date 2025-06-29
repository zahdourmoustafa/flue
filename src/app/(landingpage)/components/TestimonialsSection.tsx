"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Mayada H.",
      country: "Egypt",
      image: "👩",
      rating: 5,
      text: "I rely on the Fluentzy app in developing my vocabulary and cementing the grammar rules I learn in my English and Spanish classes.",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    {
      name: "Najar E.M.",
      country: "Morocco",
      image: "👨",
      rating: 5,
      text: "Fluentzy allows me to practice real-world conversations and receive feedback from native-level teachers.",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      name: "Bianca C.",
      country: "Romania",
      image: "👩‍🦰",
      rating: 5,
      text: "I just got my 365-day streak on Fluentzy for Japanese. Thanks a lot! The lessons are so inspiring!",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why learners love Fluentzy
          </h2>
          <p className="text-lg text-gray-600">
            Real stories from our community of language learners
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card
                className={`p-6 h-full ${testimonial.bgColor} ${testimonial.borderColor} border-2 hover:shadow-lg transition-shadow`}
              >
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl mr-4">
                      {testimonial.image}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {testimonial.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {testimonial.country}
                      </p>
                    </div>
                  </div>

                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  <p className="text-gray-700 leading-relaxed italic">
                    "{testimonial.text}"
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
