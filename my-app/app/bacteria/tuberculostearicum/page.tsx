'use client';

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useBacteria } from '@/app/context/BacteriaContext';
import optimalRanges from '@/dataAssets/optimal.json';

export default function TuberculostearicumPage() {
  const { values } = useBacteria();
  const value = values['C.Tub'];
  const [min, max] = optimalRanges['C. tuberculostearicum'];

  return (
    <main className="fixed inset-0 overflow-y-auto bg-background">
      <div className="min-h-full p-4">
        <Card className="max-w-2xl mx-auto">
          <div className="p-6 space-y-8">
            {/* Title */}
            <h1 className="text-2xl font-bold">Cutibacterium tuberculostearicum</h1>

            {/* What is this bacteria */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">What is C. tuberculostearicum?</h2>
              <p className="text-muted-foreground">
                C. tuberculostearicum is a specialized member of your skin's bacterial community. 
                It's particularly active in sebum-rich (oily) areas of your skin, where it helps 
                process skin lipids and maintains the natural balance of your skin's ecosystem. 
                This bacteria works alongside other beneficial bacteria to support skin health.
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
                    Your C. tuberculostearicum levels are above optimal. This might lead to excessive processing of skin lipids and could affect your skin's natural balance.
                  </p>
                )}
                {value < min && (
                  <p className="text-amber-800">
                    Your C. tuberculostearicum levels are below the optimal range. This could affect how well your skin processes lipids and maintains its protective barrier.
                  </p>
                )}
                {value >= min && value <= max && (
                  <p className="text-green-800">
                    Great news! Your C. tuberculostearicum levels are in the healthy range, supporting proper lipid processing and skin barrier function.
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
                  When at healthy levels, C. tuberculostearicum:
                </div>
                <ul className="list-disc list-inside space-y-1 text-green-700 text-sm">
                  <li>Helps process natural skin oils</li>
                  <li>Maintains balance in oily areas of skin</li>
                  <li>Supports overall microbiome diversity</li>
                  <li>Contributes to skin barrier function</li>
                </ul>
              </div>
            </section>

            {/* What happens when too high */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">When Levels Are Too High</h2>
              <div className="bg-red-100 rounded-lg p-4 space-y-2">
                <ul className="list-disc list-inside space-y-1 text-red-800">
                  <li>May cause excessive processing of skin lipids</li>
                  <li>Could lead to disrupted oil balance</li>
                  <li>Might affect skin barrier stability</li>
                  <li>Can create an imbalanced microbiome</li>
                  <li>May increase skin sensitivity in affected areas</li>
                </ul>
              </div>
            </section>

            {/* What happens when too low */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">When Levels Are Too Low</h2>
              <div className="bg-amber-100 rounded-lg p-4 space-y-2">
                <ul className="list-disc list-inside space-y-1 text-amber-800">
                  <li>Could affect how your skin processes oils</li>
                  <li>May lead to imbalanced lipid metabolism</li>
                  <li>Might reduce microbiome diversity</li>
                  <li>Can impact skin's natural oil regulation</li>
                  <li>May affect local skin environment stability</li>
                </ul>
              </div>
            </section>
          </div>
        </Card>
      </div>
    </main>
  );
}
