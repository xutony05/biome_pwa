'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useBacteria } from '@/app/context/BacteriaContext';
import optimalRanges from '@/dataAssets/optimal.json';
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function AcnesPage() {
  const router = useRouter();
  const { values } = useBacteria();
  const value = values?.['C.Acne'];
  const [min, max] = optimalRanges['C. acnes'];

  // Add loading state
  if (value === undefined) {
    return (
      <main className="fixed inset-0 overflow-y-auto bg-background">
        <div className="min-h-full p-4">
          <Button 
            variant="ghost" 
            className="mb-4" 
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Report
          </Button>
          <Card className="max-w-2xl mx-auto">
            <div className="p-6">
              <p>Loading...</p>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="fixed inset-0 overflow-y-auto bg-background">
      <div className="min-h-full p-4">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Report
        </Button>
        <Card className="max-w-2xl mx-auto">
          <div className="p-6 space-y-8">
            {/* Title */}
            <h1 className="text-2xl font-bold">Cutibacterium acnes</h1>

            {/* What is this bacteria */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">What is C. acnes?</h2>
              <p className="text-muted-foreground">
                C. acnes (formerly known as P. acnes) is one of the most common bacteria found on human skin. 
                It lives deep in your pores and helps maintain skin health by breaking down skin oils. 
                While it's a natural part of your skin's ecosystem, its balance is crucial for clear, healthy skin.
              </p>
            </section>

             {/* Your Profile */}
             <section className="space-y-3">
              <h2 className="text-lg font-semibold">Your Profile</h2>
              <div className={cn(
                "rounded-lg p-4 space-y-2",
                value > max ? "bg-red-100" : 
                value < min ? "bg-amber-100" : "bg-green-100"
              )}>
                <p className={cn(
                  "font-medium",
                  value > max ? "text-red-800" : 
                  value < min ? "text-amber-800" : "text-green-800"
                )}>
                  Your level: {value.toFixed(1)}%
                </p>
                {value > max && (
                  <p className="text-red-800">
                    Your C. acnes levels are above the optimal range. This might be contributing to skin concerns like acne or inflammation. Consider consulting with a healthcare provider about ways to help balance your skin microbiome.
                  </p>
                )}
                {value < min && (
                  <p className="text-amber-800">
                    Your C. acnes levels are below the optimal range. While this isn't immediately concerning, it could affect how well your skin processes oils and maintains its protective barrier.
                  </p>
                )}
                {value >= min && value <= max && (
                  <p className="text-green-800">
                    Great news! Your C. acnes levels are within the optimal range. This suggests your skin microbiome is well-balanced in terms of this bacteria.
                  </p>
                )}
              </div>
            </section>

            {/* Good Range */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">Healthy Range</h2>
              <div className="bg-green-100 rounded-lg p-4 space-y-2">
                <p className="text-green-800">Optimal levels: {min}-{max}%</p>
                <div className="text-green-700 text-sm">
                  In this range, C. acnes helps maintain healthy skin by:
                </div>
                <ul className="list-disc list-inside mt-2 space-y-1 text-green-700 text-sm">
                  <li>Breaking down excess oils</li>
                  <li>Supporting your skin's natural barrier</li>
                  <li>Protecting against harmful bacteria</li>
                </ul>
              </div>
            </section>

            {/* What happens when too high */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">When Levels Are Too High</h2>
              <div className="bg-red-100 rounded-lg p-4 space-y-2">
                <ul className="list-disc list-inside space-y-1 text-red-800">
                  <li>Can trigger inflammation leading to acne breakouts</li>
                  <li>May cause excessive oil production in your skin</li>
                  <li>Could lead to clogged pores and blackheads</li>
                  <li>Might make skin more sensitive and reactive</li>
                </ul>
              </div>
            </section>

            {/* What happens when too low */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">When Levels Are Too Low</h2>
              <div className="bg-amber-100 rounded-lg p-4 space-y-2">
                <ul className="list-disc list-inside space-y-1 text-amber-800">
                  <li>Your skin might become more vulnerable to harmful bacteria</li>
                  <li>Could lead to an imbalanced skin microbiome</li>
                  <li>May affect your skin's natural oil regulation</li>
                  <li>Might result in dry or dehydrated skin</li>
                </ul>
              </div>
            </section>
          </div>
        </Card>
      </div>
    </main>
  );
}
