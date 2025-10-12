"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

interface InputQuestionProps {
  placeholder?: string;
  onNext: (value: string) => void;
  isLargeInput?: boolean;
  isOptional?: boolean;
  previousAnswer?: string;
  questionId?: string; // Add questionId to identify specific questions
}

export function InputQuestion({ placeholder, onNext, isLargeInput, isOptional, previousAnswer, questionId }: InputQuestionProps) {
  const [value, setValue] = useState(typeof previousAnswer === 'string' ? previousAnswer : "");

  // Update value when previousAnswer prop changes
  useEffect(() => {
    if (typeof previousAnswer === 'string') {
      setValue(previousAnswer);
    } else {
      setValue("");
    }
  }, [previousAnswer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() || isOptional) {
      onNext(value);
    }
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
    <motion.form 
      onSubmit={handleSubmit} 
      className="w-full max-w-md flex flex-col space-y-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div className="w-full" variants={item}>
        {isLargeInput ? (
          <textarea
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={`w-full px-4 py-3.5 text-base leading-[1.1875rem] rounded-2xl min-h-[120px] resize-none ${
              // Add border styling for skincare brands (q9) and additional info (q10) questions
              questionId === "q9" || questionId === "q10" 
                ? "border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" 
                : ""
            }`}
            style={{ boxSizing: 'border-box' }}
          />
        ) : (
          <Input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-4 py-3.5 text-base leading-[1.1875rem] rounded-full min-h-0 h-auto"
            style={{ boxSizing: 'border-box' }}
          />
        )}
      </motion.div>
      <motion.div className="flex justify-end w-full" variants={item}>
        <button 
          type="submit"
          disabled={!isOptional && !value.trim()}
          className="inline-flex px-8 py-3.5 text-base leading-[1.125rem] rounded-full min-h-0 h-auto bg-black text-white disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF] transition-colors"
        >
          Next
        </button>
      </motion.div>
    </motion.form>
  );
}