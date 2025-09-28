'use client';

import { Button } from "@/components/ui/button";
import { MainHeader } from "@/components/ui/header";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function EstimatedAgeExplanation() {
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
          <h1 className="text-2xl font-semibold">Estimated Age</h1>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-8">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4 text-sm">
              <p>
                Your estimated age is calculated based on the composition of your skin microbiome. 
                Different bacterial species have been shown to correlate with different age groups, 
                and their relative abundances can be used to estimate biological age.
              </p>
              <p>
                The calculation takes into account:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <span className="font-medium">Cutibacterium acnes:</span> Higher levels are associated with younger skin
                </li>
                <li>
                  <span className="font-medium">Staphylococcus epidermidis:</span> Higher levels are associated with older skin
                </li>
                <li>
                  <span className="font-medium">Corynebacterium kroppenstedtii:</span> Higher levels are associated with older skin
                </li>
                <li>
                  <span className="font-medium">Corynebacterium tuberculostearicum:</span> Higher levels are associated with older skin
                </li>
                <li>
                  <span className="font-medium">Cutibacterium granulosum:</span> Higher levels are associated with younger skin
                </li>
              </ul>
              <p>
                This estimate provides insight into your skin's biological age based on its microbial composition, 
                which may differ from your chronological age. Understanding this difference can help guide 
                personalized skincare recommendations.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
