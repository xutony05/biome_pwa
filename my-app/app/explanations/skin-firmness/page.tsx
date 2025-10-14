'use client';

import { Button } from "@/components/ui/button";
import { MainHeader } from "@/components/ui/header";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from 'next/navigation';

export default function SkinFirmnessExplanation() {
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
          <h1 className="text-2xl font-semibold">Skin Firmness</h1>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-8">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4 text-sm">
              <p>
                Your Skin Firmness Score measures your skin's structural integrity and elasticity based on your 
                microbiome composition. This score takes into account the presence and abundance of bacteria 
                that either contribute to or reduce skin firmness.
              </p>
              <p>
                The score is calculated using a weighted system that considers:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <span className="font-medium">Positive Contributors:</span> Bacteria like Staphylococcus epidermidis 
                  and Cutibacterium granulosum that enhance skin firmness
                </li>
                <li>
                  <span className="font-medium">Negative Contributors:</span> Bacteria like Staphylococcus aureus, 
                  Corynebacterium kroppenstedtii, and Staphylococcus haemolyticus that may reduce skin firmness
                </li>
              </ul>
              <p>
                A higher score indicates:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Better skin elasticity and resilience</li>
                <li>Enhanced structural integrity</li>
                <li>Reduced sagging and loss of firmness</li>
                <li>More youthful skin appearance</li>
              </ul>
              <p>
                The score is normalized to a 0-100 scale, where higher scores indicate better skin firmness 
                potential. This score can help guide your skincare choices and help you understand how your 
                skin's microbiome composition affects its structural integrity.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
