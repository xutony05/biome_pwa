"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { InputQuestion } from "./components/InputQuestion";
import { SingleChoiceQuestion } from "./components/SingleChoiceQuestion";
import { MultiChoiceQuestion } from "./components/MultiChoiceQuestion";
import { FinalPage } from "./components/FinalPage";
import { useRouter } from "next/navigation";
import { useAuth } from '../context/AuthContext';
import { saveSurveyAnswers } from '../lib/supabase';

// Define question types for better type safety
interface BaseQuestion {
  id: string;
  text: string;
  type: "input" | "single" | "multi" | "final";
}

interface InputQuestionType extends BaseQuestion {
  type: "input";
  placeholder?: string;
}

interface ChoiceQuestionType extends BaseQuestion {
  type: "single" | "multi";
  options: string[];
}

interface FinalQuestionType extends BaseQuestion {
  type: "final";
  description: string;
  buttonText: string;
}

type QuestionType = InputQuestionType | ChoiceQuestionType | FinalQuestionType;

const questions: QuestionType[] = [
  {
    id: "q1",
    type: "input",
    text: "First, what's your test kit serial number?",
    placeholder: "e.g., 634123"
  },
  {
    id: "q3",
    type: "input",
    text: "What is your age?",
    placeholder: "Enter your age"
  },
  {
    id: "q4",
    type: "single",
    text: "What is your gender?",
    options: ["Female", "Male", "Non-binary"]
  },
  {
    id: "q5",
    type: "input",
    text: "What city are you based in?",
    placeholder: "Enter your city"
  },
  {
    id: "q6",
    type: "single",
    text: "How would you describe your skin?",
    options: ["Dry", "Oily", "Combination", "Balanced"]
  },
  {
    id: "q7",
    type: "multi",
    text: "Do you experience any of the following?",
    options: [
      "Acne/breakouts",
      "Rosacea",
      "Psoriasis",
      "Eczema",
      "Uneven pigmentation",
      "Wrinkles",
      "None/Other"
    ]
  },
  {
    id: "q8",
    type: "input",
    text: "Do you have any allergies?",
    placeholder: "Enter your allergies or 'None'"
  },
  {
    id: "q9",
    type: "input",
    text: "What skincare brands do you use?",
    placeholder: "Please list the brands you use (e.g., CeraVe, The Ordinary, etc.)"
  },
  {
    id: "q10",
    type: "input",
    text: "Is there anything else you would like us to know?",
    placeholder: "Share any additional information that might be relevant to your skin health"
  },
  {
    id: "q11",
    type: "final",
    text: "All done!",
    description: "We'll use your answers to make your report even more tailored to you. Now, let's get you ready for the swab.",
    buttonText: "View Instructions"
  }
];

// Header component with back and save/exit buttons
const Header = ({ onBack, isFinal = false }: { onBack: () => void; isFinal?: boolean }) => {
  const router = useRouter();
  
  return (
    <div className="flex justify-between items-center h-14 px-4 bg-white">
      {!isFinal && (
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
      <Button 
        variant="ghost" 
        className="text-base leading-[18px] hover:bg-transparent"
        onClick={() => router.push('/')}
      >
        {isFinal ? "Exit" : "Save & Exit"}
      </Button>
    </div>
  );
};

// Progress bar component
const ProgressBar = ({ current, total }: { current: number; total: number }) => (
  <Progress 
    value={(current / total) * 100} 
    className="h-3 rounded-none bg-gray-100"
  />
);

export default function SurveyPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 2;

  const handleNext = async (value: any) => {
    // Validate required fields
    if (currentQuestion.id === "q1" && !value) {
      alert("Please enter your test kit serial number");
      return;
    }
    if (currentQuestion.id === "q3" && !value) {
      alert("Please enter your age");
      return;
    }
    if (currentQuestion.id === "q4" && !value) {
      alert("Please select your gender");
      return;
    }
    if (currentQuestion.id === "q5" && !value) {
      alert("Please enter your city");
      return;
    }
    if (currentQuestion.id === "q6" && !value) {
      alert("Please select your skin type");
      return;
    }
    if (currentQuestion.id === "q7" && (!value || value.length === 0)) {
      alert("Please select at least one skin condition");
      return;
    }

    const newAnswers = {
      ...answers,
      [currentQuestion.id]: value
    };
    setAnswers(newAnswers);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } 
    if (isLastQuestion && user?.email) {
      try {
        const { error } = await saveSurveyAnswers(user.email, newAnswers);
        if (error) {
          console.error('Failed to save survey:', error);
          alert("There was an error saving your survey. Please try again.");
          return;
        }
        // Only proceed to next question if save was successful
        setCurrentQuestionIndex(prev => prev + 1);
      } catch (error) {
        console.error('Error in survey submission:', error);
        alert("There was an error saving your survey. Please try again.");
      }
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleViewInstructions = async () => {
    router.push('/instructions');
  };

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case "input":
        return (
          <InputQuestion
            key={currentQuestion.id}
            question={currentQuestion.text}
            placeholder={currentQuestion.placeholder}
            onNext={handleNext}
            isLargeInput={currentQuestion.id === "q9" || currentQuestion.id === "q10"}
          />
        );
      case "single":
      case "multi":
        const choiceQuestion = currentQuestion as ChoiceQuestionType;
        return currentQuestion.type === "single" ? (
          <SingleChoiceQuestion
            question={choiceQuestion.text}
            options={choiceQuestion.options}
            onSelect={handleNext}
          />
        ) : (
          <MultiChoiceQuestion
            question={choiceQuestion.text}
            options={choiceQuestion.options}
            onNext={handleNext}
          />
        );
      case "final":
        const finalQuestion = currentQuestion as FinalQuestionType;
        return (
          <FinalPage
            text={finalQuestion.text}
            description={finalQuestion.description}
            onViewInstructions={handleViewInstructions}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed header and progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="bg-white"> {/* Safe area background */}
          <div className="h-12 bg-white" /> {/* Safe area padding */}
          <Header 
            onBack={handleBack} 
            isFinal={currentQuestion.type === "final"}
          />
          {currentQuestion.type !== "final" && (
            <ProgressBar 
              current={currentQuestionIndex} 
              total={questions.length - 1}
            />
          )}
        </div>
      </div>

      {/* Main content with padding for fixed header */}
      <main className="flex-1 pt-32 px-6 pb-6">
        {currentQuestion.type === "final" ? (
          <div className="flex flex-col items-center">
            <div className="relative w-20 h-20 mb-4 overflow-visible">
              <Image
                src="/images/orb.png"
                alt="Orb"
                fill
                className="object-contain"
                style={{ filter: 'drop-shadow(0px 11.203px 12px rgba(0, 0, 0, 0.08))' }}
              />
            </div>
            <h1 
              className="text-[2rem] leading-[2.375rem] font-medium mb-4"
              style={{ letterSpacing: '-0.05em' }}
            >
              {currentQuestion.text}
            </h1>
            <div className="flex flex-col items-center">
              {renderQuestion()}
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="flex flex-col mb-8">
              <div className="relative w-20 h-20 mb-4 overflow-visible">
                <Image
                  src="/images/orb.png"
                  alt="Orb"
                  fill
                  className="object-contain"
                  style={{ filter: 'drop-shadow(0px 11.203px 12px rgba(0, 0, 0, 0.08))' }}
                />
              </div>
              <h1 
                className="text-[2rem] leading-[2.375rem] font-medium"
                style={{ letterSpacing: '-0.05em' }}
              >
                {currentQuestion.text}
              </h1>
            </div>
            <div className="flex justify-center">
              {renderQuestion()}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
