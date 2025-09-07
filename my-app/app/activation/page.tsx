'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { getSurveyCount, getTotalSurveyCount, getReportCount, getLastSurvey, SurveyAnswers } from "../lib/supabase";
import { Header } from "@/components/ui/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlayCircle, FileText, CheckCircle2 } from "lucide-react";

export default function ActivationPage() {
  const { user } = useAuth();
  const [surveyCount, setSurveyCount] = useState(0);
  const [totalSurveyCount, setTotalSurveyCount] = useState(0);
  const [reportCount, setReportCount] = useState(0);
  const [lastSurvey, setLastSurvey] = useState<SurveyAnswers | null>(null);

  useEffect(() => {
    async function fetchCounts() {
      if (user?.email) {
        try {
          const [surveys, totalSurveys, reports] = await Promise.all([
            getSurveyCount(user.email),
            getTotalSurveyCount(user.email),
            getReportCount(user.email)
          ]);
          setSurveyCount(surveys);
          setTotalSurveyCount(totalSurveys);
          setReportCount(reports);

          // Only fetch last survey if there are more total surveys than reports
          if (totalSurveys > reports) {
            const lastSurveyData = await getLastSurvey(user.email);
            setLastSurvey(lastSurveyData);
          }
        } catch (error) {
          console.error('Error fetching counts:', error);
        }
      }
    }
    fetchCounts();
  }, [user?.email]);

  const canViewGuide = surveyCount > reportCount && lastSurvey?.completed;

  const progressPercentage = (() => {
    if (totalSurveyCount > reportCount && lastSurvey) {
      const questionIds = ['q1', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10'];
      const idx = questionIds.indexOf(lastSurvey.last_question_answered);
      return idx >= 0 ? ((idx + 1) / questionIds.length) * 100 : 0;
    }
    return 0;
  })();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Your Skin Microbiome Journey!</h1>
          <p className="text-gray-600">Ready to discover your skin microbiome insights? Let's activate your kit.</p>
          <div className="mt-4 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid gap-6">
          {/* Activation Card */}
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <PlayCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold">Activate Your Kit</h2>
                </div>
                
                <p className="text-gray-700 mb-4">
                  Enter your kit serial number and share your skin background to get deeper insights into your skin microbiome results.
                </p>

                {/* Progress bar for Resume Activation */}
                {totalSurveyCount > reportCount && lastSurvey && (
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Activation Progress</span>
                      <span>{Math.round(progressPercentage)}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                )}

                <div className="mt-2">
                  <Link href={`/survey?mode=${totalSurveyCount > reportCount ? 'resume' : 'new'}`}>
                    <Button className="w-full sm:w-auto">
                      {totalSurveyCount > reportCount ? "Resume Activation" : "Start Activation"}
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions Card */}
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <h2 className="text-lg font-semibold">Sample Collection Guide</h2>
                </div>
                
                <p className="text-gray-700 mb-6">
                  {canViewGuide 
                    ? "Follow our step-by-step guide to collect your skin sample for accurate microbiome analysis."
                    : "After completing the activation process above, you'll get access to our step-by-step guide for collecting your skin sample."
                  }
                </p>

                <div className="mt-2">
                  <Link href={canViewGuide ? "/instructions" : "#"}>
                    <Button 
                      variant={canViewGuide ? "default" : "outline"}
                      disabled={!canViewGuide}
                      className="w-full sm:w-auto"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Instructions
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-purple-600" />
                  </div>
                  <h2 className="text-lg font-semibold">Activation Status</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                    <div className="text-sm text-blue-600 mb-1 font-medium">Kits Activated</div>
                    <div className="text-2xl font-bold text-blue-700">{surveyCount}</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                    <div className="text-sm text-green-600 mb-1 font-medium">Reports Received</div>
                    <div className="text-2xl font-bold text-green-700">{reportCount}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
