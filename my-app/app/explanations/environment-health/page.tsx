'use client';

import { Button } from "@/components/ui/button";
import { MainHeader } from "@/components/ui/header";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from 'next/navigation';

export default function EnvironmentHealthExplanation() {
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
          <h1 className="text-2xl font-semibold">Environment Health</h1>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-8">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4 text-sm">
              <p>
                While you may have limited control over your living environment, there are preventative measures you
                can take to mitigate its effects on your skin. Your skin serves as the first line of defense against external
                factors that can influence your skin's health, protecting against UV radiation and pollution particles.
              </p>
              <p>
                To evaluate the health implications of your environment, we have analyzed pollution levels specific to your
                region. This assessment provides insight into whether you reside in a healthy or unhealthy environment.
              </p>
              <p>
                Look for antioxidant-rich ingredients to safeguard your skin from harmful infiltrators. Moreover, you should
                wear sunscreen whenever you are exposed to the sun, even on cloudy days. The sun's UV rays can still
                damage your skin, leading to sunburn, premature aging, and increased risk of skin cancer.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
