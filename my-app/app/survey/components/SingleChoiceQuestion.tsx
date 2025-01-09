"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SingleChoiceQuestionProps {
  question: string;
  options: string[];
  onSelect: (value: string) => void;
}

export function SingleChoiceQuestion({ question, options, onSelect }: SingleChoiceQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setTimeout(() => {
      onSelect(option);
    }, 200);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.08
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="w-full max-w-md flex flex-col items-end space-y-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {options.map((option) => {
        const isSelected = selectedOption === option;
        return (
          <motion.button
            key={option}
            variants={item}
            onClick={() => handleSelect(option)}
            className={cn(
              "inline-flex justify-start text-left px-8 py-3.5 text-base leading-[1.125rem] rounded-full min-h-0 h-auto border transition-colors",
              isSelected 
                ? "bg-black text-white border-black" 
                : "bg-white text-black border-[#E5E7EB]"
            )}
          >
            {option}
          </motion.button>
        );
      })}
    </motion.div>
  );
} 