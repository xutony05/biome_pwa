'use client';

import { useParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useState } from 'react';
import { getReportByNumber, type Report } from '@/app/lib/supabase';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

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

  const score = 20; // This should come from your report data

  return (
    <main className="min-h-screen p-4">
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
              
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>OILY</span>
                <span>BALANCED</span>
                <span>DRY</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
