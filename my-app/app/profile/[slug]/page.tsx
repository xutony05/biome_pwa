'use client';

import { useParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useState } from 'react';
import { getReportByNumber, type Report } from '@/app/lib/supabase';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import optimalRanges from '@/dataAssets/optimal.json';

// Map database names to optimal.json names
const bacteriaNameMap: { [key: string]: string } = {
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
  'C.Krop': 'C. kroppenstedtii'
};

function calculateMicrobiomeScore(report: Report): number {
  const bacteriaLevels = Object.fromEntries(
    Object.entries(report).filter(([_, value]) => typeof value === 'number')
  );

  let totalPenalty = 0;
  let diversityPenalty = 0;

  Object.entries(bacteriaLevels).forEach(([bacteria, percentage]) => {
    const value = percentage as number;
    if (!value) return; // Skip null values
    
    // Check for diversity penalty (>70%)
    if (value > 70) {
      diversityPenalty += value - 70;
    }

    // Get optimal range if available
    const optimalName = bacteriaNameMap[bacteria];
    if (optimalName && optimalRanges[optimalName as keyof typeof optimalRanges]) {
      const [min, max] = optimalRanges[optimalName as keyof typeof optimalRanges];
      
      if (value < min) {
        totalPenalty += min - value;
      } else if (value > max) {
        totalPenalty += value - max;
      }
    }
  });

  // Calculate final score
  const score = Math.max(0, Math.min(100, 100 - totalPenalty - diversityPenalty));
  return Math.round(score);
}

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

  const score = calculateMicrobiomeScore(report);

  return (
    <main className="min-h-screen p-4 space-y-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-semibold ml-2">Report #{params.slug}</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Microbiome Balance Score</h2>
              <Button variant="ghost" className="text-sm text-blue-500 h-auto p-0">
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
              <Button variant="ghost" className="text-sm text-blue-500 h-auto p-0">
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
                  <div 
                    key={bacteria}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>{bacteria}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{(value as number).toFixed(1)}%</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
