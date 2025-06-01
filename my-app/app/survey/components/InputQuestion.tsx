"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

interface InputQuestionProps {
  placeholder?: string;
  onNext: (value: string) => void;
  isLargeInput?: boolean;
  isOptional?: boolean;
  previousAnswer?: string;
}

export function InputQuestion({ placeholder, onNext, isLargeInput, isOptional, previousAnswer }: InputQuestionProps) {
  const [value, setValue] = useState(previousAnswer || "");

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
            className="w-full px-4 py-3.5 text-base leading-[1.1875rem] rounded-2xl min-h-[120px] resize-none"
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