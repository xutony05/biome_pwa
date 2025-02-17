'use client';

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useBacteria } from '@/app/context/BacteriaContext';
import optimalRanges from '@/dataAssets/optimal.json';

export default function AvidumPage() {
  const { values } = useBacteria();
  const value = values['C.Avi'];
  const [min, max] = optimalRanges['C. avidum'];

  return (
    <main className="fixed inset-0 overflow-y-auto bg-background">
      <div className="min-h-full p-4">
        <Card className="max-w-2xl mx-auto">
          <div className="p-6 space-y-8">
            {/* Title */}
            <h1 className="text-2xl font-bold">Cutibacterium avidum</h1>

            {/* What is this bacteria */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">What is C. avidum?</h2>
              <p className="text-muted-foreground">
                C. avidum is a naturally occurring skin bacteria that's commonly found in areas 
                with many sweat glands. While less abundant than some other skin bacteria, it 
                plays a specific role in maintaining the balance of your skin's microbiome, 
                especially in moist areas of your skin.
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
                    Your C. avidum levels are above optimal. This might affect how your skin manages moisture and could lead to imbalances in moist areas of your skin.
                  </p>
                )}
                {value < min && (
                  <p className="text-amber-800">
                    Your C. avidum levels are below the optimal range. This could impact your skin's moisture processing, particularly in areas with sweat glands.
                  </p>
                )}
                {value >= min && value <= max && (
                  <p className="text-green-800">
                    Great news! Your C. avidum levels are in the healthy range, supporting proper skin moisture balance.
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
                  When at healthy levels, C. avidum:
                </div>
                <ul className="list-disc list-inside space-y-1 text-green-700 text-sm">
                  <li>Helps manage skin moisture levels</li>
                  <li>Contributes to skin's natural balance</li>
                  <li>Works with other bacteria to maintain healthy skin</li>
                </ul>
              </div>
            </section>

            {/* What happens when too high */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">When Levels Are Too High</h2>
              <div className="bg-red-100 rounded-lg p-4 space-y-2">
                <ul className="list-disc list-inside space-y-1 text-red-800">
                  <li>May cause skin to become too oily</li>
                  <li>Could lead to skin irritation</li>
                  <li>Might disrupt the balance of other bacteria</li>
                  <li>Can affect skin's moisture regulation</li>
                </ul>
              </div>
            </section>

            {/* What happens when too low */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">When Levels Are Too Low</h2>
              <div className="bg-amber-100 rounded-lg p-4 space-y-2">
                <ul className="list-disc list-inside space-y-1 text-amber-800">
                  <li>Might affect how your skin handles moisture</li>
                  <li>Could create gaps in your skin's bacterial community</li>
                  <li>May impact local immune responses</li>
                  <li>Can lead to an imbalanced skin environment</li>
                </ul>
              </div>
            </section>
          </div>
        </Card>
      </div>
    </main>
  );
}
