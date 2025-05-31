"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MultiChoiceQuestionProps {
  question: string;
  options: string[];
  onNext: (values: string[]) => void;
  previousAnswers?: string[];
}

export function MultiChoiceQuestion({ question, options, onNext, previousAnswers }: MultiChoiceQuestionProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(previousAnswers || []);

  const toggleOption = (option: string) => {
    setSelectedOptions((prev) => {
      if (prev.includes(option)) {
        return prev.filter((item) => item !== option);
      } else {
        return [...prev, option];
      }
    });
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
    <div className="w-full max-w-md flex flex-col">
      <motion.div 
        className="flex flex-wrap gap-4 mb-4 justify-end"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {options.map((option) => {
          const isSelected = selectedOptions.includes(option);
          return (
            <motion.button
              key={option}
              variants={item}
              onClick={() => toggleOption(option)}
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
      <motion.div 
        className="flex justify-end"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          delay: 0.4,
          duration: 0.5,
          ease: "easeOut"
        }}
      >
        <button
          onClick={() => onNext(selectedOptions)}
          disabled={selectedOptions.length === 0}
          className={cn(
            "inline-flex px-8 py-3.5 text-base leading-[1.125rem] rounded-full min-h-0 h-auto transition-colors",
            selectedOptions.length === 0
              ? "bg-[#E5E7EB] text-[#9CA3AF]"
              : "bg-black text-white"
          )}
        >
          Next
        </button>
      </motion.div>
    </div>
  );
} 