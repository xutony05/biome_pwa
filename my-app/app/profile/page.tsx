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
      
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Test Kit Section */}
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-600 via-blue-500 to-purple-500 p-8">
          <div className="relative z-10">
            <div className="text-white text-sm font-medium mb-2">Welcome</div>
            <h2 className="text-3xl font-bold text-white mb-3">Got your test kit?</h2>
            <p className="text-white/90 mb-6 text-lg">
              Activate your kit and follow the steps to get started.
            </p>
            <Button 
              asChild
              className="bg-white text-gray-900 hover:bg-gray-100 rounded-lg px-6 py-3 font-medium"
            >
              <Link href="/activation">Get Started</Link>
            </Button>
          </div>
        </div>

        {/* Reports Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Past Reports</h2>
          <div className="space-y-3">
            {[...Array(numberOfReports)].map((_, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <Link 
                    href={`/profile/${numberOfReports - index}`} 
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-blue-500">📄</span>
                      <span>Report #{numberOfReports - index}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
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
