'use client';

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useBacteria } from '@/app/context/BacteriaContext';
import optimalRanges from '@/dataAssets/optimal.json';

export default function GranulosumPage() {
  const { values } = useBacteria();
  const value = values['C.gran'];
  const [min, max] = optimalRanges['C. granulosum'];

  return (
    <main className="fixed inset-0 overflow-y-auto bg-background">
      <div className="min-h-full p-4">
        <Card className="max-w-2xl mx-auto">
          <div className="p-6 space-y-8">
            {/* Title */}
            <h1 className="text-2xl font-bold">Cutibacterium granulosum</h1>

            {/* What is this bacteria */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">What is C. granulosum?</h2>
              <p className="text-muted-foreground">
                C. granulosum is a beneficial skin bacteria that's part of your skin's natural 
                microbiome. It's particularly active in sebum-rich areas of your skin, where it 
                helps process skin oils and maintains a healthy balance with other bacteria. 
                While less common than C. acnes, it plays a unique role in skin health.
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
                    Your C. granulosum levels are above optimal. This might affect how your skin processes oils and could lead to increased skin sensitivity.
                  </p>
                )}
                {value < min && (
                  <p className="text-amber-800">
                    Your C. granulosum levels are below the optimal range. This could affect how well your skin processes oils and maintains its protective barrier.
                  </p>
                )}
                {value >= min && value <= max && (
                  <p className="text-green-800">
                    Great news! Your C. granulosum levels are in the healthy range, supporting balanced oil processing and skin health.
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
                  When at healthy levels, C. granulosum:
                </div>
                <ul className="list-disc list-inside space-y-1 text-green-700 text-sm">
                  <li>Helps process natural skin oils</li>
                  <li>Supports balanced oil production</li>
                  <li>Contributes to overall skin health</li>
                  <li>Works with other bacteria to maintain skin balance</li>
                </ul>
              </div>
            </section>

            {/* What happens when too high */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">When Levels Are Too High</h2>
              <div className="bg-red-100 rounded-lg p-4 space-y-2">
                <ul className="list-disc list-inside space-y-1 text-red-800">
                  <li>May affect how your skin processes oils</li>
                  <li>Could lead to increased skin sensitivity</li>
                  <li>Might disrupt the balance with other bacteria</li>
                  <li>Can impact overall skin comfort</li>
                </ul>
              </div>
            </section>

            {/* What happens when too low */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">When Levels Are Too Low</h2>
              <div className="bg-amber-100 rounded-lg p-4 space-y-2">
                <ul className="list-disc list-inside space-y-1 text-amber-800">
                  <li>Could affect how well your skin manages oils</li>
                  <li>May create gaps in your skin's bacterial community</li>
                  <li>Might impact your skin's natural processes</li>
                  <li>Can contribute to an unbalanced skin environment</li>
                </ul>
              </div>
            </section>
          </div>
        </Card>
      </div>
    </main>
  );
}
