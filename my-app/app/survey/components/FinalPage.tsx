"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FinalPageProps {
  text: string;
  description: string;
  onViewInstructions: () => void;
}

export function FinalPage({ text, description, onViewInstructions }: FinalPageProps) {
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
      className="w-full max-w-md flex flex-col items-center space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.p 
        className="w-full text-center text-gray-600 text-base font-medium leading-[18px]"
        variants={item}
      >
        {description}
      </motion.p>
      <motion.button 
        onClick={onViewInstructions}
        className="inline-flex px-8 py-3.5 text-base leading-[1.125rem] rounded-full min-h-0 h-auto bg-black text-white border border-black transition-colors"
        variants={item}
      >
        View Instructions
      </motion.button>
    </motion.div>
  );
} 