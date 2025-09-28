'use client';

import { Button } from "@/components/ui/button";
import { MainHeader } from "@/components/ui/header";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function SensitivityResponseExplanation() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <MainHeader />
      
      {/* Header Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => window.history.back()}
            className="h-10 w-10"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Sensitivity Response</h1>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-8">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4 text-sm">
              <p>
                Your Skin Sensitivity Score measures your skin's resilience to irritants and environmental 
                stressors based on your microbiome composition. This score takes into account the presence 
                and abundance of bacteria that either protect against or contribute to skin sensitivity.
              </p>
              <p>
                The score is calculated using a weighted system that considers:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <span className="font-medium">Positive Contributors:</span> Bacteria like Staphylococcus epidermidis 
                  and Staphylococcus hominis that help protect against sensitivity
                </li>
                <li>
                  <span className="font-medium">Negative Contributors:</span> Bacteria like Staphylococcus aureus, 
                  Staphylococcus haemolyticus, and Corynebacterium kroppenstedtii that may increase skin sensitivity
                </li>
              </ul>
              <p>
                A higher score indicates:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Better tolerance to skincare products</li>
                <li>Reduced likelihood of irritation</li>
                <li>More resilient skin barrier</li>
                <li>Better protection against environmental stressors</li>
              </ul>
              <p>
                The score is normalized to a 0-100 scale, where higher scores indicate better skin resilience 
                and lower sensitivity. This score can help guide your skincare choices and help you understand 
                how your skin's microbiome composition affects its sensitivity to various factors.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
