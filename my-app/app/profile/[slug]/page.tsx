'use client';

import { useParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useState } from 'react';
import { getReportByNumber, type Report } from '@/app/lib/supabase';

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

  return (
    <main className="min-h-screen p-4">
      <div className="flex items-center mb-6">
        <button className="p-2" onClick={() => window.history.back()}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 className="text-2xl font-semibold ml-2">Report #{params.slug}</h1>
      </div>

      <div className="space-y-6">
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Bacteria Levels</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">B1 Level</p>
              <p className="text-2xl font-semibold">{report.b1}%</p>
            </div>
            <div>
              <p className="text-gray-600">B2 Level</p>
              <p className="text-2xl font-semibold">{report.b2}%</p>
            </div>
            <div>
              <p className="text-gray-600">B3 Level</p>
              <p className="text-2xl font-semibold">{report.b3}%</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
