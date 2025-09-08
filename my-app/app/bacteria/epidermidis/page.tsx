'use client';

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useBacteria } from '@/app/context/BacteriaContext';
import optimalRanges from '@/dataAssets/optimal.json';
import { Header } from "@/components/ui/header";

export default function EpidermidisPage() {
  const { values } = useBacteria();
  const value = values?.['S.Epi'];
  const [min, max] = optimalRanges['S. epidermidis'];

  // Add loading state
  if (value === undefined) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header showBackButton={true} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <Card>
              <div className="p-6">
                <p>Loading...</p>
              </div>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header showBackButton={true} />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Card>
            <div className="p-6 space-y-8">
            {/* Title */}
            <h1 className="text-2xl font-bold">Staphylococcus epidermidis</h1>

            {/* What is this bacteria */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">What is S. epidermidis?</h2>
              <p className="text-muted-foreground">
                S. epidermidis is a beneficial member of your skin's microbiome. It's one of the most common 
                bacteria found on human skin and plays a crucial role in maintaining skin health by protecting 
                against harmful pathogens and supporting your skin's natural barrier function.
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
                    Your S. epidermidis levels are above the optimal range. While this bacteria is generally 
                    beneficial, too much of it might indicate an imbalance in your skin's microbiome. Consider 
                    consulting with a healthcare provider about ways to help restore balance.
                  </p>
                )}
                {value < min && (
                  <p className="text-amber-800">
                    Your S. epidermidis levels are below the optimal range. This might make your skin more 
                    vulnerable to harmful bacteria. Consider ways to support your skin's natural microbiome 
                    through gentle skincare practices.
                  </p>
                )}
                {value >= min && value <= max && (
                  <p className="text-green-800">
                    Great news! Your S. epidermidis levels are within the optimal range. This suggests your 
                    skin's microbiome is well-balanced and your natural defense systems are working effectively.
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
                  When at healthy levels, S. epidermidis:
                </div>
                <ul className="list-disc list-inside mt-2 space-y-1 text-green-700 text-sm">
                  <li>Protects against harmful bacteria</li>
                  <li>Supports skin barrier function</li>
                  <li>Helps maintain skin pH balance</li>
                  <li>Contributes to overall skin health</li>
                </ul>
              </div>
            </section>

            {/* What happens when too high */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">When Levels Are Too High</h2>
              <div className="bg-red-100 rounded-lg p-4 space-y-2">
                <ul className="list-disc list-inside space-y-1 text-red-800">
                  <li>May indicate an imbalanced microbiome</li>
                  <li>Could compete with other beneficial bacteria</li>
                  <li>Might lead to skin sensitivity</li>
                  <li>Could affect skin's natural balance</li>
                </ul>
              </div>
            </section>

            {/* What happens when too low */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">When Levels Are Too Low</h2>
              <div className="bg-amber-100 rounded-lg p-4 space-y-2">
                <ul className="list-disc list-inside space-y-1 text-amber-800">
                  <li>Your skin might be more vulnerable to harmful bacteria</li>
                  <li>Could affect your skin's natural defense system</li>
                  <li>May impact skin barrier function</li>
                  <li>Might lead to increased skin sensitivity</li>
                </ul>
              </div>
            </section>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
