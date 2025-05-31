'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { getSurveyCount, getReportCount } from "../lib/supabase";

export default function ActivationPage() {
  const { user } = useAuth();
  const [surveyCount, setSurveyCount] = useState(0);
  const [reportCount, setReportCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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

  const canViewGuide = surveyCount > reportCount;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Welcome to Your Skin Microbiome Journey!</h1>
        <p className="text-gray-600 mb-6">Ready to discover your skin microbiome insights? Let's activate your kit.</p>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-1">Activate Your Kit</h2>
          <p className="text-gray-600 mb-4">Enter your kit serial number and share your skin background to get deeper insights into your skin microbiome results.</p>
          <Link href="/survey">
            <button className="bg-blue-400 text-white font-medium px-5 py-2 rounded-full hover:bg-blue-500 transition">Start Activation</button>
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
