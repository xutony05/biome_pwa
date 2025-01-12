'use client';

import { useAuth } from '../context/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from 'next/link';
import { ChevronRight, LogOut } from "lucide-react";
import { useEffect, useState } from 'react';
import { getReportCount } from '../lib/supabase';
import { logout } from '../lib/auth';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [numberOfReports, setNumberOfReports] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.email) {
      async function fetchReportCount() {
        try {
          const count = await getReportCount(user.email);
          setNumberOfReports(count);
        } catch (error) {
          console.error('Error fetching report count:', error);
        }
      }
      fetchReportCount();
    }
  }, [loading, user?.email]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (loading || !user?.email) {
    return null;
  }

  return (
    <main className="min-h-screen p-4 space-y-6">
      {/* Logout Button */}
      <div className="flex justify-end">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleLogout}
          className="text-muted-foreground"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Test Kit Section */}
      <Card className="relative overflow-hidden border-none bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50">
        <CardContent className="relative z-10 pt-6">
          <h2 className="text-2xl font-semibold mb-2">Got your test kit?</h2>
          <p className="text-muted-foreground mb-4">
            Activate your kit and follow the steps to get started.
          </p>
          <Button 
            asChild
            variant="default"
            className="rounded-full"
          >
            <Link href="/instructions">Start</Link>
          </Button>
        </CardContent>
        {/* Decorative Gradient Blob */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-200/50 via-purple-200/50 to-green-200/50 blur-2xl rounded-full transform translate-x-10 -translate-y-10" />
      </Card>

      {/* Reports Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Past Reports</h2>
        <div className="space-y-3">
          {[...Array(numberOfReports)].map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <Link href={`/reports/${numberOfReports - index}`} className="flex justify-between items-center">
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
    </main>
  );
}
