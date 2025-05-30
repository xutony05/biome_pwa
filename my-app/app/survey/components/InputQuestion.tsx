"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface InputQuestionProps {
  question: string;
  placeholder?: string;
  onNext: (value: string) => void;
}

export function InputQuestion({ question, placeholder, onNext }: InputQuestionProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
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
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-4 py-3.5 text-base leading-[1.1875rem] rounded-full min-h-0 h-auto"
          style={{ boxSizing: 'border-box' }}
        />
      </motion.div>
      <motion.div className="flex justify-end w-full" variants={item}>
        <button 
          type="submit"
          disabled={!value.trim()}
          className="inline-flex px-8 py-3.5 text-base leading-[1.125rem] rounded-full min-h-0 h-auto bg-black text-white disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF] transition-colors"
        >
          Next
        </button>
      </motion.div>
    </motion.form>
  );
}