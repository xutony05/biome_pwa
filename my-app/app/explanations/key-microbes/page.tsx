'use client';

import { Button } from "@/components/ui/button";
import { MainHeader } from "@/components/ui/header";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from 'next/navigation';

export default function KeyMicrobesExplanation() {
  const router = useRouter();

  // Simple back handler - let the profile page handle scroll restoration
  const handleBack = () => {
    router.back();
  };
  return (
    <div className="bg-gray-50 min-h-screen">
      <MainHeader />
      
      {/* Header Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleBack}
            className="h-10 w-10"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Key Microbes</h1>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-8">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4 text-sm">
              <p>
                The Key Microbes section displays the most important bacterial species that contribute to your skin's health. 
                Each microbe plays a unique role in maintaining your skin's balance and protection.
              </p>
              <p>
                Here's what each status means:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <span className="font-medium text-green-600">Optimal Range:</span> The microbe is present in the ideal 
                  amount for maintaining healthy skin function. This is the target range we aim for.
                </li>
                <li>
                  <span className="font-medium text-amber-600">Below Optimal:</span> The microbe is present in lower than 
                  ideal amounts. This might indicate a need to support its growth through specific skincare ingredients.
                </li>
                <li>
                  <span className="font-medium text-red-600">Above Optimal:</span> The microbe is present in higher than 
                  ideal amounts. This might indicate an imbalance that could be addressed through targeted skincare.
                </li>
              </ul>
              <p>
                The optimal ranges for each microbe were determined through our proprietary research and laboratory analysis, 
                taking into account their individual roles in skin health. Some microbes are more beneficial in higher 
                amounts, while others work best in moderation.
              </p>
              <p>
                Understanding these levels helps us provide personalized recommendations to help you achieve and maintain 
                a balanced skin microbiome.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
