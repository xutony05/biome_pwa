'use client';

import { useParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useState } from 'react';
import { getReportByNumber, type Report } from '@/app/lib/supabase';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CollapsibleBacteria } from "@/components/ui/collapsible-bacteria";
import recommendations from '@/dataAssets/recommendation.json';
import optimalRanges from '@/dataAssets/optimal.json';

// Define mapping at the top level
const bacteriaFullNames: Record<string, string> = {
  'C.Acne': 'C. acnes',
  'C.Stri': 'C. striatum',
  'S.Cap': 'S. capitis',
  'S.Epi': 'S. epidermidis',
  'C.Avi': 'C. avidum',
  'C.gran': 'C. granulosum',
  'S.haem': 'S. haemolyticus',
  'S.Aur': 'S. aureus',
  'C.Tub': 'C. tuberculostearicum',
  'S.hom': 'S. hominis',
  'C.Krop': 'C. kroppenstedtii',
  'Other': 'Other species'
};

// Helper function to check if bacteria level is outside its specific optimal range
const isOutsideOptimalRange = (bacteria: string, value: number) => {
  const bacteriaKey = bacteriaFullNames[bacteria];
  const range = optimalRanges[bacteriaKey as keyof typeof optimalRanges];
  if (!range) return false;
  return value < range[0] || value > range[1];
};

// Helper function to get random recommendation
const getRandomRecommendation = (bacteria: string) => {
  const bacteriaKey = bacteriaFullNames[bacteria];
  const recs = recommendations[bacteriaKey as keyof typeof recommendations];
  
  if (recs === 'GENERAL') {
    const generalRecs = recommendations.GENERAL;
    const keys = Object.keys(generalRecs);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return {
      ingredient: randomKey,
      description: generalRecs[randomKey as keyof typeof generalRecs]
    };
  }
  
  if (recs) {
    const keys = Object.keys(recs);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return {
      ingredient: randomKey,
      description: recs[randomKey as keyof typeof recs]
    };
  }
  
  return null;
};

export default function ReportPage() {
  const params = useParams();
  const { user } = useAuth();
  const [report, setReport] = useState<Report | null>(null);
  
  useEffect(() => {
    async function fetchReport() {
      if (user?.email) {
        const reportData = await getReportByNumber(user.email, Number(params.slug));
        setReport(reportData);
      }
    }
    fetchReport();
  }, [params.slug, user?.email]);

  if (!report) return null;

  const score = report.microbiome_score || 0;

  return (
    <main className="fixed inset-0 flex flex-col">
      {/* Fixed Header */}
      <div className="bg-background z-10 p-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-semibold ml-2">Report #{params.slug}</h1>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">Microbiome Balance Score</h2>
                  <Button 
                    variant="ghost" 
                    className="text-sm text-gray-400 h-auto p-0 hover:text-gray-500"
                  >
                    EXPLAIN
                  </Button>
                </div>

                <div className="text-2xl font-bold text-blue-500">
                  {score}
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Progress value={score} className="h-2" />
                    <div 
                      className="absolute w-3 h-3 bg-blue-500 rounded-full -mt-2.5 transform -translate-x-1/2"
                      style={{ left: `${score}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">All Microbes</h2>
                  <Button 
                    variant="ghost" 
                    className="text-sm text-gray-400 h-auto p-0 hover:text-gray-500"
                  >
                    EXPLAIN
                  </Button>
                </div>

                <div className="space-y-2">
                  {Object.entries(report)
                    .filter(([key, value]) => (key.includes('.') || key === 'Other') && value !== null)
                    .sort((a, b) => {
                      if (a[0] === 'Other') return 1;
                      if (b[0] === 'Other') return -1;
                      return a[0].localeCompare(b[0]);
                    })
                    .map(([bacteria, value]) => (
                      <CollapsibleBacteria
                        key={bacteria}
                        bacteriaKey={bacteria}
                        bacteria={bacteriaFullNames[bacteria] || bacteria}
                        value={value as number}
                      />
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">Environment Health</h2>
                  <Button 
                    variant="ghost" 
                    className="text-sm text-gray-400 h-auto p-0 hover:text-gray-500"
                  >
                    EXPLAIN
                  </Button>
                </div>

                <div className="text-3xl font-bold">
                  {report.env_score}
                  <span className="text-base font-normal text-muted-foreground ml-1">/10</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">Recommendations</h2>
                  <Button 
                    variant="ghost" 
                    className="text-sm text-gray-400 h-auto p-0 hover:text-gray-500"
                  >
                    EXPLAIN
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-accent rounded-lg">
                    <h3 className="font-medium mb-2">Ingredients to Look Out For</h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      {Object.entries(report)
                        .filter(([key, value]) => {
                          return (key.includes('.') || key === 'Other') && 
                            value !== null && 
                            isOutsideOptimalRange(key, value as number);
                        })
                        .map(([bacteria]) => {
                          const recommendation = getRandomRecommendation(bacteria);
                          return recommendation ? (
                            <li key={bacteria} className="space-y-1">
                              <span className="font-medium">{recommendation.ingredient}</span>
                              <p className="ml-6 text-sm">{recommendation.description}</p>
                            </li>
                          ) : null;
                        })}
                    </ul>
                  </div>

                  <div className="p-4 bg-accent rounded-lg">
                    <h3 className="font-medium mb-2">Lifestyle Tips</h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Stay hydrated</li>
                      <li>Protect from UV exposure</li>
                      <li>Maintain a balanced diet</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
