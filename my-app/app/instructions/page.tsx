'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, CheckCircle, Circle } from 'lucide-react';

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
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < stepsData.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push('/profile');
    }
  };

  const handleTabClick = (index: number) => {
    setCurrentStep(index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Sample Collection Guide</h1>
          <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">Follow these step-by-step instructions to collect your skin sample for accurate microbiome analysis.</p>
          <div className="mt-6 w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto rounded-full"></div>
        </div>

        {/* Progress Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
          {stepsData.map((step, index) => (
            <button 
              key={step.title}
              onClick={() => handleTabClick(index)}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                index === currentStep
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {step.title}
            </button>
          ))}
        </div>

        {/* Instructions Card */}
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{stepsData[currentStep].title}</h2>
              </div>

              <div className="space-y-8">
                {stepsData[currentStep].instructions.map((instruction) => (
                  <div key={instruction.step} className="flex items-start space-x-6">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-lg font-bold border-2 border-green-200">
                      {instruction.step}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-gray-800 leading-7 text-lg">
                        {instruction.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <div className="flex space-x-2">
                  {stepsData.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleTabClick(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentStep ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <Button
                  onClick={handleNext}
                  className="flex items-center gap-2"
                >
                  {currentStep === stepsData.length - 1 ? 'Done!' : 'Next'}
                  {currentStep < stepsData.length - 1 && <ChevronRight className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
