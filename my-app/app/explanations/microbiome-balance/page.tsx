'use client';

import { Button } from "@/components/ui/button";
import { MainHeader } from "@/components/ui/header";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from 'next/navigation';

export default function MicrobiomeBalanceExplanation() {
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
          <h1 className="text-2xl font-semibold">Microbiome Balance Score</h1>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-8">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4 text-sm">
              <p>
                Your Microbiome Balance Score is a comprehensive measure of your skin's microbial ecosystem health. 
                This score takes into account the presence and abundance of key beneficial bacteria that contribute 
                to skin health and protection.
              </p>
              <p>
                Our research methodology combines extensive scientific literature review with in-house laboratory analysis:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <span className="font-medium">Scientific Literature Analysis:</span> We analyzed over 100 peer-reviewed studies 
                  to identify key bacterial species associated with healthy skin. This included research on skin barrier function, 
                  inflammation markers, and microbial diversity in healthy individuals.
                </li>
                <li>
                  <span className="font-medium">Laboratory Validation:</span> Our research team conducted controlled studies 
                  in our state-of-the-art laboratory, analyzing skin samples from diverse populations to validate the optimal 
                  ranges for each bacterial species.
                </li>
              </ul>
              <p>
                A higher score indicates a more balanced and diverse microbiome, which is associated with:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Enhanced skin barrier function</li>
                <li>Better protection against harmful pathogens</li>
                <li>Improved skin hydration and moisture retention</li>
                <li>Reduced inflammation and sensitivity</li>
                <li>More resilient skin that can better handle environmental stressors</li>
              </ul>
              <p>
                The score is calculated based on the optimal ranges of various beneficial bacteria species, 
                considering both their presence and relative abundance. These ranges were determined through 
                our proprietary research and laboratory analysis. Maintaining a balanced microbiome 
                is crucial for overall skin health and can help prevent various skin concerns.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
