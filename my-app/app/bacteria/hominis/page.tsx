'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useBacteria } from '@/app/context/BacteriaContext';
import optimalRanges from '@/dataAssets/optimal.json';
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function HominisPage() {
  const router = useRouter();
  const { values } = useBacteria();
  const value = values['S.hom'];
  const [min, max] = optimalRanges['S. hominis'];

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
            <h1 className="text-2xl font-bold">Staphylococcus hominis</h1>

            {/* What is this bacteria */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">What is S. hominis?</h2>
              <p className="text-muted-foreground">
                S. hominis is one of the most common beneficial bacteria found on human skin. 
                As its name suggests ('hominis' means 'of human'), it's specifically adapted 
                to live on human skin. This bacteria plays an important role in your skin's 
                defense system and helps maintain a healthy skin environment.
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
                  Your level: {value?.toFixed(1)}%
                </p>
                {value > max && (
                  <p className="text-red-800">
                    Your S. hominis levels are above the optimal range. This might be disrupting the balance of other beneficial bacteria and could lead to increased skin sensitivity.
                  </p>
                )}
                {value < min && (
                  <p className="text-amber-800">
                    Your S. hominis levels are below the optimal range. This could weaken your skin's natural defense system and reduce the production of beneficial compounds.
                  </p>
                )}
                {value >= min && value <= max && (
                  <p className="text-green-800">
                    Great news! Your S. hominis levels are within the optimal range, helping maintain your skin's natural defense system and bacterial balance.
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
                  When at healthy levels, S. hominis:
                </div>
                <ul className="list-disc list-inside space-y-1 text-green-700 text-sm">
                  <li>Supports your skin's natural defense system</li>
                  <li>Helps maintain bacterial balance</li>
                  <li>Contributes to skin barrier health</li>
                  <li>Produces beneficial compounds for skin</li>
                </ul>
              </div>
            </section>

            {/* What happens when too high */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">When Levels Are Too High</h2>
              <div className="bg-red-100 rounded-lg p-4 space-y-2">
                <ul className="list-disc list-inside space-y-1 text-red-800">
                  <li>May disrupt the balance of other beneficial bacteria</li>
                  <li>Could lead to increased skin sensitivity</li>
                  <li>Might affect skin's natural processes</li>
                  <li>Can overwhelm other beneficial bacteria</li>
                  <li>May impact skin's comfort and appearance</li>
                </ul>
              </div>
            </section>

            {/* What happens when too low */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">When Levels Are Too Low</h2>
              <div className="bg-amber-100 rounded-lg p-4 space-y-2">
                <ul className="list-disc list-inside space-y-1 text-amber-800">
                  <li>Could weaken skin's natural defense system</li>
                  <li>May reduce beneficial compound production</li>
                  <li>Might create gaps in skin protection</li>
                  <li>Can affect overall microbiome balance</li>
                  <li>May impact skin's natural maintenance</li>
                </ul>
              </div>
            </section>
          </div>
        </Card>
      </div>
    </main>
  );
}
