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
  const value = values['C.Krop'];
  const [min, max] = optimalRanges['C. kroppenstedtii'];

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
            <h1 className="text-2xl font-bold">Cutibacterium kroppenstedtii</h1>

            {/* What is this bacteria */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">What is C. kroppenstedtii?</h2>
              <p className="text-muted-foreground">
                C. kroppenstedtii is a unique member of the Cutibacterium family found on human skin. 
                Unlike its relatives, it has a distinctive approach to processing skin oils. This 
                bacteria plays a specialized role in maintaining your skin's lipid balance and 
                contributes to the overall health of your skin's microbiome.
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
                    Your C. kroppenstedtii levels are above optimal. This might affect your skin's lipid processing and could lead to imbalances in your skin's oil management.
                  </p>
                )}
                {value < min && (
                  <p className="text-amber-800">
                    Your C. kroppenstedtii levels are below the optimal range. This could impact how efficiently your skin processes lipids and maintains its natural balance.
                  </p>
                )}
                {value >= min && value <= max && (
                  <p className="text-green-800">
                    Great news! Your C. kroppenstedtii levels are in the healthy range, supporting proper lipid processing and skin microbiome diversity.
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
                <ul className="list-disc list-inside space-y-1 text-green-700 text-sm">
                  <li>Helps maintain skin lipid balance</li>
                  <li>Supports healthy oil metabolism</li>
                  <li>Contributes to microbiome diversity</li>
                  <li>Works with other bacteria for skin health</li>
                </ul>
              </div>
            </section>

            {/* What happens when too high */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">When Levels Are Too High</h2>
              <div className="bg-red-100 rounded-lg p-4 space-y-2">
                <ul className="list-disc list-inside space-y-1 text-red-800">
                  <li>May alter normal skin oil processing</li>
                  <li>Could affect skin moisture balance</li>
                  <li>Might disrupt other bacterial populations</li>
                  <li>Can lead to skin sensitivity</li>
                  <li>May impact overall skin comfort</li>
                </ul>
              </div>
            </section>

            {/* What happens when too low */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">When Levels Are Too Low</h2>
              <div className="bg-amber-100 rounded-lg p-4 space-y-2">
                <ul className="list-disc list-inside space-y-1 text-amber-800">
                  <li>Could affect lipid processing efficiency</li>
                  <li>May reduce microbiome diversity</li>
                  <li>Might impact skin's natural processes</li>
                  <li>Can create gaps in bacterial community</li>
                  <li>May affect local skin environment</li>
                </ul>
              </div>
            </section>
          </div>
        </Card>
      </div>
    </main>
  );
}
