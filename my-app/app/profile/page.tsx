'use client';

import { useAuth } from '../context/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MainHeader } from "@/components/ui/header";
import Link from 'next/link';
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from 'react';
import { getReportsWithDates, getSurveyCount, getReportCount } from '../lib/supabase';

interface ReportWithDate {
  created_at: string;
  report_number: number;
  kit_id?: string;
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [reports, setReports] = useState<ReportWithDate[]>([]);
  const [surveyCount, setSurveyCount] = useState(0);
  const [reportCount, setReportCount] = useState(0);

  useEffect(() => {
    if (!loading && user?.email) {
      async function fetchReports() {
        try {
          if (user?.email) {
            const [reportsData, surveys, reports] = await Promise.all([
              getReportsWithDates(user.email),
              getSurveyCount(user.email),
              getReportCount(user.email)
            ]);
            setReports(reportsData);
            setSurveyCount(surveys);
            setReportCount(reports);
          }
        } catch (error) {
          console.error('Error fetching reports:', error);
        }
      }
      fetchReports();
    }
  }, [loading, user?.email]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading || !user?.email) {
    return null;
  }

  return (
    <div className="bg-gray-50">
      <MainHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6">
        {/* Test Kit Section */}
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-600 via-blue-500 to-purple-500 p-4 sm:p-8">
          <div className="relative z-10">
            <div className="text-white text-xs sm:text-sm font-medium mb-1 sm:mb-2">Welcome</div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3">Got your test kit?</h2>
            <p className="text-white/90 mb-4 sm:mb-6 text-sm sm:text-base md:text-lg">
              Activate your kit and follow the steps to get started.
            </p>
            <Button 
              asChild
              className="bg-white text-gray-900 hover:bg-gray-100 rounded-lg px-4 sm:px-6 py-2 sm:py-3 font-medium text-sm sm:text-base w-full sm:w-auto"
            >
              <Link href="/activation">Get Started</Link>
            </Button>
          </div>
        </div>

        {/* Pending Reports Section */}
        {surveyCount > reportCount && (
          <section>
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Pending Reports</h2>
            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-yellow-500 text-sm sm:text-base">⏳</span>
                  <div className="flex flex-col">
                    <span className="text-sm sm:text-base font-medium">
                      {surveyCount - reportCount} {surveyCount - reportCount === 1 ? 'Report' : 'Reports'} Processing
                    </span>
                    <span className="text-xs sm:text-sm text-yellow-600 font-medium">
                      Results expected in 1-2 weeks
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Reports Section */}
        <section>
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Your Reports</h2>
          <div className="space-y-2 sm:space-y-3">
            {reports.map((report, index) => (
              <Card key={`report-${report.report_number}-${index}`}>
                <CardContent className="p-3 sm:p-4">
                  <Link 
                    href={`/profile/${report.report_number}`} 
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-blue-500 text-sm sm:text-base">📄</span>
                      <div className="flex flex-col">
                        <span className="text-sm sm:text-base font-medium">Report #{report.report_number}</span>
                        <div className="flex flex-col sm:flex-row sm:gap-2">
                          <span className="text-xs sm:text-sm text-gray-500">{formatDate(report.created_at)}</span>
                          {report.kit_id && (
                            <span className="text-xs sm:text-sm text-gray-500">Kit ID: {report.kit_id}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
