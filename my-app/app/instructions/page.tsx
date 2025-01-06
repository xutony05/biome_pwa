'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";

const stepsData = [
  {
    title: "Prepare",
    instructions: [
      {
        step: 1,
        content: "For accurate results, wash off all products and makeup before bed. Do not apply any products after cleansing."
      }
    ]
  },
  {
    title: "Setup",
    instructions: [
      {
        step: 1,
        content: "Collect your sample in the morning, before showering or using any products, including water, on your face."
      },
      {
        step: 2,
        content: "Write the sampling date on the collection tube."
      },
      {
        step: 3,
        content: "Wash your hands thoroughly."
      },
      {
        step: 4,
        content: "Carefully remove the swab, holding it only by the handle below the breaking point. Avoid touching the swab tip."
      }
    ]
  },
  {
    title: "Swab",
    instructions: [
      {
        step: 1,
        content: "Rub the swab around your forehead with pressure for 20 seconds."
      },
      {
        step: 2,
        content: "Rotate the swab ¼ turn and rub again around your nose for 20 seconds."
      },
      {
        step: 3,
        content: "Rotate the swab ¼ turn and rub again around your chin for 20 seconds."
      },
      {
        step: 4,
        content: "Rotate the swab ¼ turn and rub again around your cheek for 20 seconds."
      },
      {
        step: 5,
        content: "Insert the swab head into the tube, snap it off at the breaking point, and tightly close the tube."
      }
    ]
  },
  {
    title: "Ship",
    instructions: [
      {
        step: 1,
        content: "Find the prepaid envelope by lifting the cardboard insert."
      },
      {
        step: 2,
        content: "Place the tube inside the envelope."
      },
      {
        step: 3,
        content: "Drop it off at the nearest shipping location."
      },
      {
        step: 4,
        content: "All done!"
      }
    ]
  }
];

export default function InstructionsPage() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < stepsData.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleTabClick = (index: number) => {
    setCurrentStep(index);
  };

  return (
    <main className="min-h-screen p-4">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button className="p-2" onClick={() => window.history.back()}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 className="text-2xl font-semibold ml-2">{stepsData[currentStep].title}</h1>
      </div>

      {/* Progress Tabs */}
      <div className="flex justify-between mb-8 border-b">
        {stepsData.map((step, index) => (
          <button 
            key={step.title}
            onClick={() => handleTabClick(index)}
            className={`flex-1 text-center pb-2 text-sm transition-colors ${
              index === currentStep 
                ? 'border-b-2 border-blue-500 text-blue-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {step.title}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {stepsData[currentStep].instructions.map((instruction) => (
          <div key={instruction.step} className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-sm">
              {instruction.step}
            </div>
            <p className="text-gray-600 flex-1">
              {instruction.content}
            </p>
          </div>
        ))}
      </div>

      {/* Next Button */}
      <div className="fixed bottom-8 right-4 left-4">
        <Button
          onClick={handleNext}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full"
          size="lg"
        >
          {currentStep === stepsData.length - 1 ? 'Done!' : 'Next'}
        </Button>
      </div>
    </main>
  );
}
