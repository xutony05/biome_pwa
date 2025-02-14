'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useState } from 'react';
import { getReportByNumber, type Report } from '@/app/lib/supabase';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { CollapsibleBacteria } from "../../../components/ui/collapsible-bacteria";
import optimalRanges from '@/dataAssets/optimal.json';

const isOutsideOptimalRange = (bacteria: string, value: number) => {
  const bacteriaKey = bacteria
    .replace('C.Acne', 'C. acnes')
    .replace('C.Stri', 'C. striatum')
    .replace('S.Cap', 'S. capitis')
    .replace('S.Epi', 'S. epidermidis')
    .replace('C.Avi', 'C. avidum')
    .replace('C.gran', 'C. granulosum')
    .replace('S.haem', 'S. haemolyticus')
    .replace('S.Aur', 'S. aureus')
    .replace('C.Tub', 'C. tuberculostearicum')
    .replace('S.hom', 'S. hominis')
    .replace('C.Krop', 'C. kroppenstedtii');
  
  const range = optimalRanges[bacteriaKey as keyof typeof optimalRanges];
  if (!range) return false;
  return value < range[0] || value > range[1];
};

export default function ReportPage() {
  const params = useParams();
  const { user } = useAuth();
  const [report, setReport] = useState<Report | null>(null);
  const router = useRouter();
  
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
      <div className="bg-background z-10 p-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-semibold ml-2">Report #{params.slug}</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="space-y-4">
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
                    .map(([bacteria, value]) => {
                      const isOutside = isOutsideOptimalRange(bacteria, value as number);
                      return (
                        <CollapsibleBacteria 
                          key={bacteria}
                          bacteria={bacteria}
                          value={value as number}
                          isOutsideRange={isOutside}
                        />
                      );
                    })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
