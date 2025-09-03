'use client';

import { useAuth } from '../context/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MainHeader } from "@/components/ui/header";
import Link from 'next/link';
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from 'react';
import { getReportCount } from '../lib/supabase';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [numberOfReports, setNumberOfReports] = useState(0);

  useEffect(() => {
    if (!loading && user?.email) {
      async function fetchReportCount() {
        try {
          if (user?.email) {
            const count = await getReportCount(user.email);
            setNumberOfReports(count);
          }
        } catch (error) {
          console.error('Error fetching report count:', error);
        }
      }
      fetchReportCount();
    }
  }, [loading, user?.email]);

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

        {/* Reports Section */}
        <section>
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Past Reports</h2>
          <div className="space-y-2 sm:space-y-3">
            {[...Array(numberOfReports)].map((_, index) => (
              <Card key={index}>
                <CardContent className="p-3 sm:p-4">
                  <Link 
                    href={`/profile/${numberOfReports - index}`} 
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-blue-500 text-sm sm:text-base">📄</span>
                      <span className="text-sm sm:text-base">Report #{numberOfReports - index}</span>
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
