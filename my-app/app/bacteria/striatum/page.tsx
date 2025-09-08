'use client';

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useBacteria } from '@/app/context/BacteriaContext';
import optimalRanges from '@/dataAssets/optimal.json';
import { Header } from "@/components/ui/header";

export default function StriatumPage() {
  const { values } = useBacteria();
  const value = values['C.Stri'];
  const [min, max] = optimalRanges['C. striatum'];

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
            <h1 className="text-2xl font-bold">Corynebacterium striatum</h1>

            {/* What is this bacteria */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">What is C. striatum?</h2>
              <p className="text-muted-foreground">
                C. striatum is a naturally occurring bacteria found on human skin. It plays a key role 
                in maintaining skin health by working with other bacteria to create a balanced environment. 
                Think of it as part of your skin's protective team that helps keep your skin healthy.
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
                    Your C. striatum levels are elevated. This could be affecting your skin's bacterial balance and may contribute to increased sensitivity or irritation.
                  </p>
                )}
                {value < min && (
                  <p className="text-amber-800">
                    Your C. striatum levels are lower than optimal. This might affect how your skin maintains its natural balance and protective functions.
                  </p>
                )}
                {value >= min && value <= max && (
                  <p className="text-green-800">
                    Great news! Your C. striatum levels are in the healthy range, contributing to a balanced skin microbiome and supporting overall skin health.
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
                  When at healthy levels, C. striatum:
                </div>
                <ul className="list-disc list-inside space-y-1 text-green-700 text-sm">
                  <li>Helps protect your skin's natural barrier</li>
                  <li>Works with other good bacteria to keep skin balanced</li>
                  <li>Supports overall skin health</li>
                </ul>
              </div>
            </section>

            {/* What happens when too high */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">When Levels Are Too High</h2>
              <div className="bg-red-100 rounded-lg p-4 space-y-2">
                <ul className="list-disc list-inside space-y-1 text-red-800">
                  <li>Can crowd out other helpful bacteria your skin needs</li>
                  <li>May lead to dry or irritated skin</li>
                  <li>Could make your skin more sensitive</li>
                  <li>Might disrupt your skin's natural balance</li>
                </ul>
              </div>
            </section>

            {/* What happens when too low */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">When Levels Are Too Low</h2>
              <div className="bg-amber-100 rounded-lg p-4 space-y-2">
                <ul className="list-disc list-inside space-y-1 text-amber-800">
                  <li>Your skin might lose some of its natural protection</li>
                  <li>Could allow unwanted bacteria to grow more easily</li>
                  <li>May affect how well your skin maintains its health</li>
                  <li>Might make your skin more easily irritated</li>
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
