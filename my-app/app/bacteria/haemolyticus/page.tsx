'use client';

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useBacteria } from '@/app/context/BacteriaContext';
import optimalRanges from '@/dataAssets/optimal.json';

export default function HaemolyticusPage() {
  const { values } = useBacteria();
  const value = values['S.haem'];
  const [min, max] = optimalRanges['S. haemolyticus'];

  return (
    <main className="fixed inset-0 overflow-y-auto bg-background">
      <div className="min-h-full p-4">
        <Card className="max-w-2xl mx-auto">
          <div className="p-6 space-y-8">
            {/* Title */}
            <h1 className="text-2xl font-bold">Staphylococcus haemolyticus</h1>

            {/* What is this bacteria */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">What is S. haemolyticus?</h2>
              <p className="text-muted-foreground">
                S. haemolyticus is a sophisticated member of the skin's bacterial community. 
                Found naturally across different areas of your skin, it plays a unique role in 
                maintaining skin health. This bacteria is particularly interesting because it 
                helps create a diverse and resilient skin environment when kept at proper levels.
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
                    Your S. haemolyticus levels are above optimal. This could be overwhelming other beneficial bacteria and may increase your skin's sensitivity to environmental factors.
                  </p>
                )}
                {value < min && (
                  <p className="text-amber-800">
                    Your S. haemolyticus levels are below the optimal range. This might reduce the complexity of your skin's bacterial ecosystem and could weaken your skin's natural protective systems.
                  </p>
                )}
                {value >= min && value <= max && (
                  <p className="text-green-800">
                    Great news! Your S. haemolyticus levels are in the healthy range, contributing to a diverse and balanced skin microbiome.
                  </p>
                )}
              </div>
            </section>

            {/* Good Range */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">Healthy Range</h2>
              <div className="bg-green-100 rounded-lg p-4 space-y-2">
                <p className="text-green-800">Optimal levels: {min}-{max}%</p>
                <p className="text-green-700 text-sm">
                  When at healthy levels, S. haemolyticus:
                </p>
                <ul className="list-disc list-inside space-y-1 text-green-700 text-sm">
                  <li>Enhances your skin's microbial diversity</li>
                  <li>Helps maintain proper bacterial balance</li>
                  <li>Supports your skin's protective barrier</li>
                  <li>Contributes to overall skin resilience</li>
                </ul>
              </div>
            </section>

            {/* What happens when too high */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">When Levels Are Too High</h2>
              <div className="bg-red-100 rounded-lg p-4 space-y-2">
                <ul className="list-disc list-inside space-y-1 text-red-800">
                  <li>Can overwhelm and displace other beneficial bacteria</li>
                  <li>May increase skin's sensitivity to environmental factors</li>
                  <li>Could disrupt your skin's natural defense mechanisms</li>
                  <li>Might affect how your skin responds to skincare products</li>
                  <li>Can lead to an unstable skin microbiome</li>
                </ul>
              </div>
            </section>

            {/* What happens when too low */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">When Levels Are Too Low</h2>
              <div className="bg-amber-100 rounded-lg p-4 space-y-2">
                <ul className="list-disc list-inside space-y-1 text-amber-800">
                  <li>May reduce the complexity of your skin's bacterial ecosystem</li>
                  <li>Could weaken your skin's natural protective systems</li>
                  <li>Might make your skin more susceptible to imbalances</li>
                  <li>Can affect how well your skin maintains its health</li>
                  <li>May impact your skin's ability to adapt to changes</li>
                </ul>
              </div>
            </section>
          </div>
        </Card>
      </div>
    </main>
  );
}
