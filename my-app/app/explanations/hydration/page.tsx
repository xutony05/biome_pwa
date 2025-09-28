'use client';

import { Button } from "@/components/ui/button";
import { MainHeader } from "@/components/ui/header";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function HydrationExplanation() {
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
          <h1 className="text-2xl font-semibold">Hydration Score</h1>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-8">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4 text-sm">
              <p>
                Your Hydration Score is a specialized measure that evaluates your skin's moisture balance based on the 
                composition of your skin microbiome. This score takes into account the presence and abundance of specific 
                bacteria that are known to influence skin hydration levels.
              </p>
              <p>
                The score is calculated using a sophisticated algorithm that considers:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <span className="font-medium">Age-Specific Optimal Ranges:</span> Different bacterial compositions are 
                  optimal for different age groups. The algorithm adjusts its calculations based on your age to provide 
                  more accurate results.
                </li>
                <li>
                  <span className="font-medium">Bacterial Weights:</span> Each bacterial species is assigned a specific 
                  weight based on its impact on skin hydration. Some bacteria contribute positively to hydration, while 
                  others may have a negative effect.
                </li>
                <li>
                  <span className="font-medium">Optimal Ranges:</span> Each bacterial species has an optimal range that 
                  contributes to healthy skin hydration. The algorithm evaluates how well your bacterial composition 
                  aligns with these ranges.
                </li>
              </ul>
              <p>
                A higher hydration score indicates:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Better moisture retention in the skin</li>
                <li>More balanced skin barrier function</li>
                <li>Reduced likelihood of dryness and dehydration</li>
                <li>Improved skin elasticity and suppleness</li>
              </ul>
              <p>
                The score is normalized to a 0-100 scale, where higher scores indicate better hydration potential. 
                This score can help guide your skincare choices and help you understand how your skin's microbiome 
                composition affects its hydration levels.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
