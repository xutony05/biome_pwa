"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MultiChoiceQuestionProps {
  options: string[];
  onNext: (values: string[]) => void;
  previousAnswers?: string[];
}

export function MultiChoiceQuestion({ options, onNext, previousAnswers }: MultiChoiceQuestionProps) {
  // Initialize state with previous answers
  const initializeState = () => {
    const answers = previousAnswers || [];
    const hasOtherInput = answers.some(answer => !options.includes(answer));
    const otherValue = hasOtherInput ? answers.find(answer => !options.includes(answer)) || "" : "";
    const selectedOpts = answers.filter(answer => options.includes(answer));
    
    // If there's a custom input, add "None/Other" to selected options
    if (hasOtherInput) {
      selectedOpts.push("None/Other");
    }
    
    return { selectedOptions: selectedOpts, otherInput: otherValue };
  };

  const initialState = initializeState();
  const [selectedOptions, setSelectedOptions] = useState<string[]>(initialState.selectedOptions);
  const [otherInput, setOtherInput] = useState<string>(initialState.otherInput);

  const toggleOption = (option: string) => {
    setSelectedOptions((prev) => {
      if (prev.includes(option)) {
        // If deselecting "None/Other", clear the input
        if (option === "None/Other") {
          setOtherInput("");
        }
        return prev.filter((item) => item !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  const handleNext = () => {
    let finalAnswers = [...selectedOptions];
    
    // If "None/Other" is selected and there's input, replace "None/Other" with the input
    if (selectedOptions.includes("None/Other") && otherInput.trim()) {
      finalAnswers = finalAnswers.filter(option => option !== "None/Other");
      finalAnswers.push(otherInput.trim());
    }
    
    onNext(finalAnswers);
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
      
      {/* Input field for "None/Other" option */}
      {selectedOptions.includes("None/Other") && (
        <motion.div 
          className="w-full max-w-md mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 0.2,
            duration: 0.3,
            ease: "easeOut"
          }}
        >
          <input
            type="text"
            value={otherInput}
            onChange={(e) => setOtherInput(e.target.value)}
            placeholder="Please specify..."
            className="w-full px-4 py-3 text-base border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </motion.div>
      )}
      
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
          onClick={handleNext}
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