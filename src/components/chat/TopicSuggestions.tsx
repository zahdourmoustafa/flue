"use client";

import { Button } from "@/components/ui/button";

interface TopicSuggestionsProps {
  onTopicSelect: (topic: string) => void;
  learningLanguage: "en" | "es";
}

const topics = {
  es: [
    {
      id: "1",
      text: "Divertido",
    },
    {
      id: "2",
      text: "Interesante",
    },
    {
      id: "3",
      text: "Tú decides",
    },
  ],
  en: [
    {
      id: "1",
      text: "Fun",
    },
    {
      id: "2",
      text: "Interesting",
    },
    {
      id: "3",
      text: "You decide",
    },
  ],
};

export function TopicSuggestions({
  onTopicSelect,
  learningLanguage,
}: TopicSuggestionsProps) {
  const currentTopics = topics[learningLanguage];

  return (
    <div className="flex justify-center px-4 py-6">
      <div className="flex flex-wrap gap-3 justify-center max-w-md">
        {currentTopics.map((topic) => (
          <Button
            key={topic.id}
            variant="outline"
            className="rounded-full border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 px-6 py-2"
            onClick={() => onTopicSelect(topic.text)}
          >
            {topic.text}
          </Button>
        ))}
      </div>
    </div>
  );
}
