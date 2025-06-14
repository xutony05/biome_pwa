'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useBacteria } from '@/app/context/BacteriaContext';
import optimalRanges from '@/dataAssets/optimal.json';
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function KroppenstedtiiPage() {
  const router = useRouter();
  const { values } = useBacteria();
  const value = values?.['C.Krop'];
  const [min, max] = optimalRanges['C. kroppenstedtii'];

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
            <h1 className="text-2xl font-bold">Corynebacterium kroppenstedtii</h1>

            {/* What is this bacteria */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">What is C. kroppenstedtii?</h2>
              <p className="text-muted-foreground">
                C. kroppenstedtii is a member of the skin microbiome that requires careful monitoring. 
                While it can be found naturally on human skin, its presence needs to be kept at low 
                levels to maintain optimal skin health. This bacteria is best kept in check by other 
                beneficial members of your skin's microbiome.
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
                    Your C. kroppenstedtii levels are above the optimal range. This could potentially lead to 
                    skin concerns and imbalances in your skin microbiome. It's recommended to consult with 
                    a healthcare provider about ways to help restore balance to your skin's bacterial community.
                  </p>
                )}
                {value < min && (
                  <p className="text-amber-800">
                    Your C. kroppenstedtii levels are below the optimal range. While this is generally not a concern, 
                    maintaining a balanced microbiome is important for overall skin health. Your skin's natural 
                    defenses appear to be keeping this bacteria well regulated.
                  </p>
                )}
                {value >= min && value <= max && (
                  <p className="text-green-800">
                    Great news! Your C. kroppenstedtii levels are within the optimal range. This suggests your skin's 
                    microbiome is well-balanced and your natural defense systems are working effectively to maintain 
                    healthy bacterial levels.
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
                  When at healthy levels, C. kroppenstedtii:
                </div>
                <ul className="list-disc list-inside mt-2 space-y-1 text-green-700 text-sm">
                  <li>Remains in check by other beneficial bacteria</li>
                  <li>Coexists within a balanced microbiome</li>
                  <li>Doesn't interfere with skin health</li>
                  <li>Stays regulated by skin's natural defenses</li>
                </ul>
              </div>
            </section>

            {/* What happens when too high */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">When Levels Are Too High</h2>
              <div className="bg-red-100 rounded-lg p-4 space-y-2">
                <ul className="list-disc list-inside space-y-1 text-red-800">
                  <li>Can disrupt skin barrier function</li>
                  <li>May cause increased skin sensitivity</li>
                  <li>Could lead to various skin concerns</li>
                  <li>Often indicates an imbalanced microbiome</li>
                  <li>Might compete with beneficial bacteria</li>
                </ul>
              </div>
            </section>

            {/* What happens when too low */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">When Levels Are Low</h2>
              <div className="bg-green-100 rounded-lg p-4 space-y-2">
                <ul className="list-disc list-inside space-y-1 text-green-800">
                  <li>This is actually good for your skin</li>
                  <li>Allows beneficial bacteria to thrive</li>
                  <li>Indicates a well-functioning skin barrier</li>
                  <li>Shows your skin's defense system is working</li>
                  <li>Supports overall skin health</li>
                </ul>
              </div>
            </section>
          </div>
        </Card>
      </div>
    </main>
  );
}
