'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { getSurveyCount, getReportCount, getLastSurvey, SurveyAnswers } from "../lib/supabase";

export default function ActivationPage() {
  const { user } = useAuth();
  const [surveyCount, setSurveyCount] = useState(0);
  const [reportCount, setReportCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSurvey, setLastSurvey] = useState<SurveyAnswers | null>(null);

  useEffect(() => {
    async function fetchCounts() {
      if (user?.email) {
        console.log('Fetching counts for user:', user.email);
        try {
          const [surveys, reports] = await Promise.all([
            getSurveyCount(user.email),
            getReportCount(user.email)
          ]);
          console.log('Fetched counts:', { surveys, reports });
          setSurveyCount(surveys);
          setReportCount(reports);

          // Only fetch last survey if there are more surveys than reports
          if (surveys > reports) {
            const lastSurveyData = await getLastSurvey(user.email);
            setLastSurvey(lastSurveyData);
          }
        } catch (error) {
          console.error('Error fetching counts:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log('No user email available');
        setIsLoading(false);
      }
    }
    fetchCounts();
  }, [user?.email]);

  const canViewGuide = surveyCount > reportCount && lastSurvey?.completed;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Welcome to Your Skin Microbiome Journey!</h1>
        <p className="text-gray-600 mb-6">Ready to discover your skin microbiome insights? Let's activate your kit.</p>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-1">Activate Your Kit</h2>
          <p className="text-gray-600 mb-4">Enter your kit serial number and share your skin background to get deeper insights into your skin microbiome results.</p>
          {/* Progress bar for Resume Activation */}
          {surveyCount > reportCount && lastSurvey && (
            <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
              <div
                className="h-2 bg-blue-400 rounded-full transition-all"
                style={{ width: `${(() => {
                  // List of survey question IDs (excluding final page)
                  const questionIds = [
                    'q1', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10'
                  ];
                  const idx = questionIds.indexOf(lastSurvey.last_question_answered);
                  // Progress is (idx+1)/total if found, else 0
                  return idx >= 0 ? ((idx + 1) / questionIds.length) * 100 : 0;
                })()}%` }}
              />
            </div>
          )}
          <Link href={`/survey?mode=${surveyCount > reportCount ? 'resume' : 'new'}`}>
            <button className="bg-blue-400 text-white font-medium px-5 py-2 rounded-full hover:bg-blue-500 transition">
              {surveyCount > reportCount ? "Resume Activation" : "Start Activation"}
            </button>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-1">Sample Collection Guide</h2>
          <p className="text-gray-600 mb-4">
            {canViewGuide 
              ? "Follow our step-by-step guide to collect your skin sample for accurate microbiome analysis."
              : "After completing the activation process above, you'll get access to our step-by-step guide for collecting your skin sample."
            }
          </p>
          <Link href={canViewGuide ? "/instructions" : "#"}>
            <button 
              className={`font-medium px-5 py-2 rounded-full transition ${
                canViewGuide 
                  ? "bg-blue-400 text-white hover:bg-blue-500" 
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!canViewGuide}
            >
              View Instructions
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
