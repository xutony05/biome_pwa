'use client';

import { useAuth } from '../context/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from 'next/link';
import { ChevronRight } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen p-4 space-y-6">
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
          <Card>
            <CardContent className="p-4">
              <Link href="/reports/2" className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-blue-500">📄</span>
                  <span>Report #2</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Nov. 16</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <Link href="/reports/1" className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-blue-500">📄</span>
                  <span>Report #1</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Oct. 18</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
