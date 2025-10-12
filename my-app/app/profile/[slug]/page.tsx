'use client';

import { useParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getReportByNumber, type Report } from '@/app/lib/supabase';
import { calculateMicrobiomeScore, calculateHydrationScore, estimateAge, calculateAntioxidantScore, calculateSebumIndex, calculateSensitivityScore } from '@/app/lib/calculations';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { MainHeader } from "@/components/ui/header";
import { ChevronLeft } from "lucide-react";
import { CheckCircle2, XCircle, Leaf, Apple, Heart, ShoppingBag, ExternalLink } from "lucide-react";
import { CollapsibleBacteria } from "@/components/ui/collapsible-bacteria";
import { ProductRoutineTabs } from "@/components/ui/product-routine-tabs";
import optimalRanges from '@/dataAssets/optimal.json';
import codex from '@/dataAssets/codex.json';
import { useBacteria } from '@/app/context/BacteriaContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from 'next/link';

const getOptimalRangeStatus = (bacteria: string, value: number) => {
  const bacteriaKey = bacteria
    .replace('C.Acne', 'C. acnes')
    .replace('C.Stri', 'C. striatum')
    .replace('S.Cap', 'S. capitis')
    .replace('S.Epi', 'S. epidermidis')
    .replace('C.Avi', 'C. avidum')
    .replace('C.Gran', 'C. granulosum')
    .replace('S.Haem', 'S. haemolyticus')
    .replace('S.Aur', 'S. aureus')
    .replace('C.Tub', 'C. tuberculostearicum')
    .replace('S.Hom', 'S. hominis')
    .replace('C.Krop', 'C. kroppenstedtii');
  
  const range = optimalRanges[bacteriaKey as keyof typeof optimalRanges];
  if (!range) return 'optimal'; // default to optimal if no range found

  if (value > range[1]) return 'above';
  if (value < range[0]) return 'below';
  return 'optimal';
};

const getFullBacteriaName = (bacteria: string) => {
  const nameMap: { [key: string]: string } = {
    'C.Acne': 'Cutibacterium acnes',
    'C.Stri': 'Corynebacterium striatum',
    'S.Cap': 'Staphylococcus capitis',
    'S.Epi': 'Staphylococcus epidermidis',
    'C.Avi': 'Corynebacterium avidum',
    'C.Gran': 'Cutibacterium granulosum',
    'S.Haem': 'Staphylococcus haemolyticus',
    'S.Aur': 'Staphylococcus aureus',
    'C.Tub': 'Corynebacterium tuberculostearicum',
    'S.Hom': 'Staphylococcus hominis',
    'C.Krop': 'Corynebacterium kroppenstedtii'
  };
  
  return nameMap[bacteria] || bacteria;
};

const getBacteriaRoute = (bacteria: string) => {
  const routeMap: { [key: string]: string } = {
    'C.Acne': 'acnes',
    'C.Stri': 'striatum',
    'S.Cap': 'capitis',
    'S.Epi': 'epidermidis',
    'C.Avi': 'avidum',
    'C.Gran': 'granulosum',
    'S.Haem': 'haemolyticus',
    'S.Aur': 'aureus',
    'C.Tub': 'tuberculostearicum',
    'S.Hom': 'hominis',
    'C.Krop': 'kroppenstedtii'
  };
  
  return routeMap[bacteria] || bacteria;
};

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [report, setReport] = useState<Report | null>(null);
  const { setValues } = useBacteria();
  const [isMobile, setIsMobile] = useState(false);
  const [showEnvExplanation, setShowEnvExplanation] = useState(false);
  const [showScoreExplanation, setShowScoreExplanation] = useState(false);
  const [showMicrobesExplanation, setShowMicrobesExplanation] = useState(false);
  const [showProductsExplanation, setShowProductsExplanation] = useState(false);
  const [showHydrationExplanation, setShowHydrationExplanation] = useState(false);
  const [showAgeExplanation, setShowAgeExplanation] = useState(false);
  const [showAntioxidantExplanation, setShowAntioxidantExplanation] = useState(false);
  const [showFirmnessExplanation, setShowFirmnessExplanation] = useState(false);
  const [showSensitivityExplanation, setShowSensitivityExplanation] = useState(false);
  
  useEffect(() => {
    async function fetchReport() {
      if (user?.email) {
        const reportData = await getReportByNumber(user.email, Number(params.slug));
        setReport(reportData);
        // Set bacteria values
        if (reportData) {
          setValues({
            'C.Acne': reportData['C.Acne'],
            'C.Stri': reportData['C.Stri'],
            'S.Cap': reportData['S.Cap'],
            'S.Epi': reportData['S.Epi'],
            'C.Avi': reportData['C.Avi'],
            'C.Gran': reportData['C.Gran'],
            'S.Haem': reportData['S.Haem'],
            'S.Aur': reportData['S.Aur'],
            'C.Tub': reportData['C.Tub'],
            'S.Hom': reportData['S.Hom'],
            'C.Krop': reportData['C.Krop']
          });
        }
      }
    }
    fetchReport();
  }, [params.slug, user?.email, setValues]);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle explain button clicks
  const handleExplainClick = (explanationType: string) => {
    if (isMobile) {
      router.push(`/explanations/${explanationType}`);
    } else {
      // Show dialog for desktop
      switch (explanationType) {
        case 'microbiome-balance':
          setShowScoreExplanation(true);
          break;
        case 'estimated-age':
          setShowAgeExplanation(true);
          break;
        case 'environment-health':
          setShowEnvExplanation(true);
          break;
        case 'key-microbes':
          setShowMicrobesExplanation(true);
          break;
        case 'antioxidant-capacity':
          setShowAntioxidantExplanation(true);
          break;
        case 'sensitivity-response':
          setShowSensitivityExplanation(true);
          break;
        case 'sebum-index':
          setShowFirmnessExplanation(true);
          break;
        case 'hydration':
          setShowHydrationExplanation(true);
          break;
        case 'product-recommendations':
          setShowProductsExplanation(true);
          break;
      }
    }
  };

  if (!report) return null;

  const bacteriaPercentages = {
    'C.Acne': report['C.Acne'],
    'C.Stri': report['C.Stri'],
    'S.Cap': report['S.Cap'],
    'S.Epi': report['S.Epi'],
    'C.Avi': report['C.Avi'],
    'C.Gran': report['C.Gran'],
    'S.Haem': report['S.Haem'],
    'S.Aur': report['S.Aur'],
    'C.Tub': report['C.Tub'],
    'S.Hom': report['S.Hom'],
    'C.Krop': report['C.Krop']
  };

  const estimatedAge = estimateAge(bacteriaPercentages, report.age);
  const score = calculateMicrobiomeScore(report.age, bacteriaPercentages);
  const hydrationScore = calculateHydrationScore(report.age, bacteriaPercentages);
  const antioxidantScoreResult = calculateAntioxidantScore(bacteriaPercentages, report.age);
  const antioxidantScore = antioxidantScoreResult.final_score;
  const sebumIndex = calculateSebumIndex(bacteriaPercentages, report.age);
  const sensitivityScoreResult = calculateSensitivityScore(bacteriaPercentages, report.age < 40 ? 'young' : 'old');
  const sensitivityScore = sensitivityScoreResult.final_score;

  return (
    <div className="bg-gray-50">
      <MainHeader />
      
      {/* Report Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => window.history.back()}
            className="h-10 w-10"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Report #{params.slug}</h1>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <div className="space-y-4">
          <Card className="w-full">
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Header with icon and explain button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-medium text-foreground">
                      Microbiome Balance Score
                    </h2>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-auto p-0 text-sm text-blue-500 hover:text-blue-600"
                    onClick={() => handleExplainClick('microbiome-balance')}
                    aria-label="Explain microbiome balance score"
                  >
                    EXPLAIN
                  </Button>
                </div>

                {/* Score display and slider */}
                <div className="space-y-4">
                  {/* Score number positioned above slider */}
                  <div className="relative h-8">
                    <div 
                      className="absolute -translate-x-1/2 -translate-y-2 text-2xl font-bold text-sky-400"
                      style={{ left: `${Math.min(Math.max(score, 0), 100)}%` }}
                      aria-label={`Score: ${score}`}
                    >
                      {score}
                    </div>
                  </div>

                  {/* Horizontal slider bar */}
                  <div className="relative">
                    {/* Main slider track */}
                    <div className="h-3 overflow-hidden rounded-full bg-muted">
                      {/* Blue filled portion */}
                      <div 
                        className="h-full rounded-full bg-sky-400 transition-all duration-300 ease-in-out"
                        style={{ width: `${Math.min(Math.max(score, 0), 100)}%` }}
                        aria-hidden="true"
                      />
                    </div>
                    
                    {/* Dotted dividers */}
                    <div 
                      className="absolute top-0 h-3 w-px -translate-x-1/2 border-l-2 border-dotted border-muted-foreground/40"
                      style={{ left: '33.33%' }}
                      aria-hidden="true"
                    />
                    <div 
                      className="absolute top-0 h-3 w-px -translate-x-1/2 border-l-2 border-dotted border-muted-foreground/40"
                      style={{ left: '66.66%' }}
                      aria-hidden="true"
                    />
                  </div>

                  {/* Skin type labels removed - no longer displaying oily, balanced, dry labels */}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium">Estimated Age</h2>
                    <Button 
                      variant="ghost" 
                      className="text-sm text-blue-500 h-auto p-0"
                      onClick={() => handleExplainClick('estimated-age')}
                    >
                      EXPLAIN
                    </Button>
                  </div>

                  <div className="text-3xl font-bold">
                    {typeof estimatedAge === 'object' && typeof estimatedAge.final_age === 'number'
                      ? Math.round(estimatedAge.final_age) 
                      : 'N/A'}
                    <span className="text-base font-normal text-muted-foreground ml-1">years</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium">Environment Health</h2>
                    <Button 
                      variant="ghost" 
                      className="text-sm text-blue-500 h-auto p-0"
                      onClick={() => handleExplainClick('environment-health')}
                    >
                      EXPLAIN
                    </Button>
                  </div>

                  <div className="text-3xl font-bold">
                    {report.env_score}
                    <span className="text-base font-normal text-muted-foreground ml-1">/100</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-medium">Key Microbes</h2>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="text-sm text-blue-500 h-auto p-0"
                    onClick={() => handleExplainClick('key-microbes')}
                  >
                    EXPLAIN
                  </Button>
                </div>

                {/* Composition Bars */}
                <div className="space-y-4">
                  {(() => {
                    // Calculate actual percentages for each category
                    const bacteriaData = Object.entries(report)
                      .filter(([key, value]) => key.includes('.') && value !== null)
                      .map(([bacteria, value]) => ({
                        bacteria,
                        value: value as number,
                        status: getOptimalRangeStatus(bacteria, value as number)
                      }));

                    const totalDisruptive = bacteriaData
                      .filter(item => item.status === 'above')
                      .reduce((sum, item) => sum + item.value, 0);
                    
                    const totalNeutral = bacteriaData
                      .filter(item => item.status === 'below')
                      .reduce((sum, item) => sum + item.value, 0);
                    
                    const totalHelpful = bacteriaData
                      .filter(item => item.status === 'optimal')
                      .reduce((sum, item) => sum + item.value, 0);

                    const total = totalDisruptive + totalNeutral + totalHelpful;
                    
                    const disruptivePercent = total > 0 ? (totalDisruptive / total * 100) : 0;
                    const neutralPercent = total > 0 ? (totalNeutral / total * 100) : 0;
                    const helpfulPercent = total > 0 ? (totalHelpful / total * 100) : 0;

                    return (
                      <div className="flex justify-center gap-4 sm:gap-8 px-2 sm:px-0">
                        {/* Your Composition Bar */}
                        <div className="flex flex-col items-center space-y-2">
                          <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Your Composition</h3>
                          <div className="w-32 h-56 sm:w-40 sm:h-80 bg-gray-200 rounded-lg overflow-hidden flex flex-col">
                            {disruptivePercent > 0 && (
                              <div 
                                className="bg-red-500 flex items-center justify-center"
                                style={{ height: `${disruptivePercent}%` }}
                              >
                                <span className="text-xs font-medium text-white">
                                  {disruptivePercent.toFixed(1)}%
                                </span>
                              </div>
                            )}
                            {neutralPercent > 0 && (
                              <div 
                                className="bg-sky-400 flex items-center justify-center"
                                style={{ height: `${neutralPercent}%` }}
                              >
                                <span className="text-xs font-medium text-white">
                                  {neutralPercent.toFixed(1)}%
                                </span>
                              </div>
                            )}
                            {helpfulPercent > 0 && (
                              <div 
                                className="bg-emerald-400 flex items-center justify-center"
                                style={{ height: `${helpfulPercent}%` }}
                              >
                                <span className="text-xs font-medium text-white">
                                  {helpfulPercent.toFixed(1)}%
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Ideal Composition Bar */}
                        <div className="flex flex-col items-center space-y-2">
                          <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Ideal Composition</h3>
                          <div className="w-32 h-56 sm:w-40 sm:h-80 bg-gray-200 rounded-lg overflow-hidden flex flex-col">
                            {/* Disruptive section - 20% of total height */}
                            <div 
                              className="bg-red-500 flex items-center justify-center"
                              style={{ height: '20%' }}
                            >
                              <span className="text-xs font-medium text-white">20%</span>
                            </div>
                            {/* Neutral section - 30% of total height */}
                            <div 
                              className="bg-sky-400 flex items-center justify-center"
                              style={{ height: '30%' }}
                            >
                              <span className="text-xs font-medium text-white">30%</span>
                            </div>
                            {/* Helpful section - 50% of total height */}
                            <div 
                              className="bg-emerald-400 flex items-center justify-center"
                              style={{ height: '50%' }}
                            >
                              <span className="text-xs font-medium text-white">50%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Color Legend */}
                  <div className="flex justify-center gap-3 sm:gap-6 text-xs sm:text-sm px-2 sm:px-0">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span>Disruptive</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-sky-400" />
                      <span>Neutral</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                      <span>Helpful</span>
                    </div>
                  </div>
                </div>

                {/* Microbe List */}
                <div className="space-y-2">
                  {Object.entries(report)
                    .filter(([key, value]) => key.includes('.') && value !== null)
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .map(([bacteria, value]) => {
                      const status = getOptimalRangeStatus(bacteria, value as number);
                      const getStatusColor = (status: string) => {
                        switch (status) {
                          case 'above': return 'bg-red-500';
                          case 'optimal': return 'bg-emerald-400';
                          case 'below': return 'bg-sky-400';
                          default: return 'bg-sky-400';
                        }
                      };
                      const getStatusLabel = (status: string) => {
                        switch (status) {
                          case 'above': return 'Disruptive';
                          case 'optimal': return 'Helpful';
                          case 'below': return 'Neutral';
                          default: return 'Neutral';
                        }
                      };
                      
                      return (
                        <Link 
                          key={bacteria} 
                          href={`/bacteria/${getBacteriaRoute(bacteria)}`}
                          className="block"
                        >
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`} />
                              <span className="font-medium">{getFullBacteriaName(bacteria)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{value as number}%</span>
                              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skin Traits Section */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">Skin Traits</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Antioxidant Capacity */}
              <Card className="w-full">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                        <h3 className="text-sm font-medium text-foreground">Antioxidant Capacity</h3>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-auto p-0 text-xs text-blue-500 hover:text-blue-600"
                        onClick={() => handleExplainClick('antioxidant-capacity')}
                      >
                        EXPLAIN
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-sky-400 rounded-full transition-all duration-300"
                          style={{ width: `${antioxidantScore}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Non-Ideal</span>
                        <span>Ideal</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sensitivity Response */}
              <Card className="w-full">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                        <h3 className="text-sm font-medium text-foreground">Sensitivity Response</h3>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-auto p-0 text-xs text-blue-500 hover:text-blue-600"
                        onClick={() => handleExplainClick('sensitivity-response')}
                      >
                        EXPLAIN
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-400 rounded-full transition-all duration-300"
                          style={{ width: `${sensitivityScore}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Not sensitive</span>
                        <span>Sensitive</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sebum Index */}
              <Card className="w-full">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                        <h3 className="text-sm font-medium text-foreground">Sebum Index</h3>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-auto p-0 text-xs text-blue-500 hover:text-blue-600"
                        onClick={() => handleExplainClick('sebum-index')}
                      >
                        EXPLAIN
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-500 rounded-full transition-all duration-300"
                          style={{ width: `${sebumIndex}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Matte</span>
                        <span>Oily</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Hydration (Pigmentation equivalent) */}
              <Card className="w-full">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                        <h3 className="text-sm font-medium text-foreground">Hydration</h3>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-auto p-0 text-xs text-blue-500 hover:text-blue-600"
                        onClick={() => handleExplainClick('hydration')}
                      >
                        EXPLAIN
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-600 rounded-full transition-all duration-300"
                          style={{ width: `${hydrationScore}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Non-Ideal</span>
                        <span>Ideal</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">Personalized Product Recommendations</h2>
                  <Button 
                    variant="ghost" 
                    className="text-sm text-blue-500 h-auto p-0"
                    onClick={() => handleExplainClick('product-recommendations')}
                  >
                    EXPLAIN
                  </Button>
                </div>

                {report.products ? (
                  <ProductRoutineTabs products={report.products} />
                ) : (
                  <div className="p-6 bg-accent/50 rounded-lg border border-accent text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <ShoppingBag className="h-8 w-8 opacity-50" />
                      <p>No personalized products recommended at this time.</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">Recommendations</h2>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-accent/50 rounded-lg border border-accent">
                    <div className="flex items-center gap-2 mb-4">
                      <Leaf className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Skincare Ingredients</h3>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          <h4 className="text-sm font-medium text-emerald-500">Recommended Ingredients</h4>
                        </div>
                        <div className="grid gap-3">
                          {report.good_ingredients?.map((ingredient: string, index: number) => (
                            <div key={index} className="bg-background/50 rounded-lg p-3 border border-emerald-500/20">
                              <span className="font-medium text-emerald-500">{ingredient}</span>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {codex.ingredients[ingredient as keyof typeof codex.ingredients]}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <XCircle className="h-4 w-4 text-muted-foreground" />
                          <h4 className="text-sm font-medium text-muted-foreground">Ingredients to Avoid</h4>
                        </div>
                        <div className="grid gap-3">
                          {report.avoid_ingredients?.map((ingredient: string, index: number) => (
                            <div key={index} className="bg-background/50 rounded-lg p-3">
                              <span className="font-medium text-muted-foreground">{ingredient}</span>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {codex.ingredients[ingredient as keyof typeof codex.ingredients]}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-accent/50 rounded-lg border border-accent">
                    <div className="flex items-center gap-2 mb-4">
                      <Apple className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Dietary Recommendations</h3>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          <h4 className="text-sm font-medium text-emerald-500">Foods to Include</h4>
                        </div>
                        <div className="grid gap-3">
                          {report.good_food?.map((food: string, index: number) => (
                            <div key={index} className="bg-background/50 rounded-lg p-3 border border-emerald-500/20">
                              <span className="font-medium text-emerald-500">{food}</span>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {codex.diet[food as keyof typeof codex.diet]}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <XCircle className="h-4 w-4 text-muted-foreground" />
                          <h4 className="text-sm font-medium text-muted-foreground">Foods to Avoid</h4>
                        </div>
                        <div className="grid gap-3">
                          {report.avoid_food?.map((food: string, index: number) => (
                            <div key={index} className="bg-background/50 rounded-lg p-3">
                              <span className="font-medium text-muted-foreground">{food}</span>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {codex.diet[food as keyof typeof codex.diet]}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-accent/50 rounded-lg border border-accent">
                    <div className="flex items-center gap-2 mb-4">
                      <Heart className="h-5 w-5 text-emerald-500" />
                      <h3 className="text-lg font-semibold">Lifestyle Tips</h3>
                    </div>
                    <div className="grid gap-3">
                      {report.lifestyle?.map((tip: string, index: number) => (
                        <div key={index} className="bg-background/50 rounded-lg p-3 border border-emerald-500/20">
                          <span className="font-medium text-emerald-500">{tip}</span>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {codex.lifestyle[tip as keyof typeof codex.lifestyle]}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
            <p className="font-medium mb-2">Disclaimer</p>
            <p className="space-y-2">
              Please note that our microbiome tests are not substitutes for medical testing, consultations, diagnoses, or
              treatments. If you have severe skin conditions, it is advisable to consult your local doctor. The information
              and advice provided in your report should not replace any medical treatment you are receiving from a
              dermatologist. All results are intended to enhance your skincare routine and help you better understand
              your skin. Do not delay seeking medical advice based on the information in the report.
            </p>
          </div>
        </div>
      </div>

      <Dialog open={showScoreExplanation} onOpenChange={setShowScoreExplanation}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Microbiome Balance Score Explanation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <p>
              Your Microbiome Balance Score is a comprehensive measure of your skin's microbial ecosystem health. 
              This score takes into account the presence and abundance of key beneficial bacteria that contribute 
              to skin health and protection.
            </p>
            <p>
              Our research methodology combines extensive scientific literature review with in-house laboratory analysis:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-medium">Scientific Literature Analysis:</span> We analyzed over 100 peer-reviewed studies 
                to identify key bacterial species associated with healthy skin. This included research on skin barrier function, 
                inflammation markers, and microbial diversity in healthy individuals.
              </li>
              <li>
                <span className="font-medium">Laboratory Validation:</span> Our research team conducted controlled studies 
                in our state-of-the-art laboratory, analyzing skin samples from diverse populations to validate the optimal 
                ranges for each bacterial species.
              </li>
            </ul>
            <p>
              A higher score indicates a more balanced and diverse microbiome, which is associated with:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Enhanced skin barrier function</li>
              <li>Better protection against harmful pathogens</li>
              <li>Improved skin hydration and moisture retention</li>
              <li>Reduced inflammation and sensitivity</li>
              <li>More resilient skin that can better handle environmental stressors</li>
            </ul>
            <p>
              The score is calculated based on the optimal ranges of various beneficial bacteria species, 
              considering both their presence and relative abundance. These ranges were determined through 
              our proprietary research and laboratory analysis. Maintaining a balanced microbiome 
              is crucial for overall skin health and can help prevent various skin concerns.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEnvExplanation} onOpenChange={setShowEnvExplanation}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Environment Health Explanation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <p>
              While you may have limited control over your living environment, there are preventative measures you
              can take to mitigate its effects on your skin. Your skin serves as the first line of defense against external
              factors that can influence your skin's health, protecting against UV radiation and pollution particles.
            </p>
            <p>
              To evaluate the health implications of your environment, we have analyzed pollution levels specific to your
              region. This assessment provides insight into whether you reside in a healthy or unhealthy environment.
            </p>
            <p>
              Look for antioxidant-rich ingredients to safeguard your skin from harmful infiltrators. Moreover, you should
              wear sunscreen whenever you are exposed to the sun, even on cloudy days. The sun's UV rays can still
              damage your skin, leading to sunburn, premature aging, and increased risk of skin cancer.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showMicrobesExplanation} onOpenChange={setShowMicrobesExplanation}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Key Microbes Explanation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <p>
              The Key Microbes section displays the most important bacterial species that contribute to your skin's health. 
              Each microbe plays a unique role in maintaining your skin's balance and protection.
            </p>
            <p>
              Here's what each status means:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-medium text-green-600">Optimal Range:</span> The microbe is present in the ideal 
                amount for maintaining healthy skin function. This is the target range we aim for.
              </li>
              <li>
                <span className="font-medium text-amber-600">Below Optimal:</span> The microbe is present in lower than 
                ideal amounts. This might indicate a need to support its growth through specific skincare ingredients.
              </li>
              <li>
                <span className="font-medium text-red-600">Above Optimal:</span> The microbe is present in higher than 
                ideal amounts. This might indicate an imbalance that could be addressed through targeted skincare.
              </li>
            </ul>
            <p>
              The optimal ranges for each microbe were determined through our proprietary research and laboratory analysis, 
              taking into account their individual roles in skin health. Some microbes are more beneficial in higher 
              amounts, while others work best in moderation.
            </p>
            <p>
              Understanding these levels helps us provide personalized recommendations to help you achieve and maintain 
              a balanced skin microbiome.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showProductsExplanation} onOpenChange={setShowProductsExplanation}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Personalized Product Recommendations Explanation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <p>
              We have curated some product recommendations below. This is not an exhaustive list - the key is to look
              for the recommended medical ingredients in your products. More expensive products tend to have
              more complex formulations with more recommended ingredients. However, there exists diminishing returns;
              you do not need expensive products to look amazing!
            </p>
            <p>
              Our recommended products are carefully selected based on your unique skin microbiome profile and test results. 
              Each product is chosen to help support and maintain your skin's optimal bacterial balance.
            </p>
            <p>
              The selection process takes into account:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-medium">Microbiome Compatibility:</span> Products that support the growth of beneficial 
                bacteria while maintaining a balanced ecosystem.
              </li>
              <li>
                <span className="font-medium">Ingredient Analysis:</span> Careful evaluation of ingredients to ensure they 
                align with your skin's needs and avoid any potential irritants.
              </li>
              <li>
                <span className="font-medium">Scientific Research:</span> Products backed by research demonstrating their 
                effectiveness in supporting skin microbiome health.
              </li>
              <li>
                <span className="font-medium">Value Consideration:</span> While we may recommend some premium products, 
                we emphasize that effective skincare doesn't have to be expensive. Focus on finding products with the 
                right ingredients for your skin.
              </li>
            </ul>
            <p>
              These recommendations are personalized to your specific skin profile and are designed to help you achieve 
              and maintain a healthy, balanced skin microbiome. Remember that consistency is key when introducing new 
              products to your skincare routine.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showHydrationExplanation} onOpenChange={setShowHydrationExplanation}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Hydration Score Explanation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <p>
              Your Hydration Score is a specialized measure that evaluates your skin's moisture balance based on the 
              composition of your skin microbiome. This score takes into account the presence and abundance of specific 
              bacteria that are known to influence skin hydration levels.
            </p>
            <p>
              The score is calculated using a sophisticated algorithm that considers:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-medium">Age-Specific Optimal Ranges:</span> Different bacterial compositions are 
                optimal for different age groups. The algorithm adjusts its calculations based on your age to provide 
                more accurate results.
              </li>
              <li>
                <span className="font-medium">Bacterial Weights:</span> Each bacterial species is assigned a specific 
                weight based on its impact on skin hydration. Some bacteria contribute positively to hydration, while 
                others may have a negative effect.
              </li>
              <li>
                <span className="font-medium">Optimal Ranges:</span> Each bacterial species has an optimal range that 
                contributes to healthy skin hydration. The algorithm evaluates how well your bacterial composition 
                aligns with these ranges.
              </li>
            </ul>
            <p>
              A higher hydration score indicates:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Better moisture retention in the skin</li>
              <li>More balanced skin barrier function</li>
              <li>Reduced likelihood of dryness and dehydration</li>
              <li>Improved skin elasticity and suppleness</li>
            </ul>
            <p>
              The score is normalized to a 0-100 scale, where higher scores indicate better hydration potential. 
              This score can help guide your skincare choices and help you understand how your skin's microbiome 
              composition affects its hydration levels.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAgeExplanation} onOpenChange={setShowAgeExplanation}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Estimated Age Explanation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <p>
              Your estimated age is calculated based on the composition of your skin microbiome. 
              Different bacterial species have been shown to correlate with different age groups, 
              and their relative abundances can be used to estimate biological age.
            </p>
            <p>
              The calculation takes into account:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-medium">Cutibacterium acnes:</span> Higher levels are associated with younger skin
              </li>
              <li>
                <span className="font-medium">Staphylococcus epidermidis:</span> Higher levels are associated with older skin
              </li>
              <li>
                <span className="font-medium">Corynebacterium kroppenstedtii:</span> Higher levels are associated with older skin
              </li>
              <li>
                <span className="font-medium">Corynebacterium tuberculostearicum:</span> Higher levels are associated with older skin
              </li>
              <li>
                <span className="font-medium">Cutibacterium granulosum:</span> Higher levels are associated with younger skin
              </li>
            </ul>
            <p>
              This estimate provides insight into your skin's biological age based on its microbial composition, 
              which may differ from your chronological age. Understanding this difference can help guide 
              personalized skincare recommendations.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAntioxidantExplanation} onOpenChange={setShowAntioxidantExplanation}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Antioxidant Score Explanation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <p>
              Your Antioxidant Score measures your skin's ability to combat oxidative stress based on your 
              microbiome composition. This score takes into account the presence and abundance of bacteria 
              that either contribute to or reduce antioxidant activity in your skin.
            </p>
            <p>
              The score is calculated using a weighted system that considers:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-medium">Positive Contributors:</span> Bacteria like Staphylococcus epidermidis 
                that enhance antioxidant activity
              </li>
              <li>
                <span className="font-medium">Negative Contributors:</span> Bacteria like Staphylococcus aureus and 
                Corynebacterium kroppenstedtii that may reduce antioxidant activity
              </li>
              <li>
                <span className="font-medium">Neutral Bacteria:</span> Species that have minimal impact on 
                antioxidant levels
              </li>
            </ul>
            <p>
              A higher score indicates:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Better protection against environmental stressors</li>
              <li>Enhanced ability to combat free radicals</li>
              <li>More resilient skin barrier function</li>
              <li>Reduced oxidative damage</li>
            </ul>
            <p>
              The score is normalized to a 0-100 scale, where higher scores indicate better antioxidant 
              potential. This score can help guide your skincare choices and help you understand how your 
              skin's microbiome composition affects its ability to combat oxidative stress.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showFirmnessExplanation} onOpenChange={setShowFirmnessExplanation}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Sebum Index Explanation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <p>
              Your Sebum Index measures your skin's oil production potential based on your microbiome composition. 
              This score takes into account the presence and abundance of bacteria that influence sebum production 
              and regulation in your skin.
            </p>

            <p>
              The score is calculated using a weighted system that considers:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-medium">Positive Contributors:</span> Bacteria like Cutibacterium acnes 
                and Cutibacterium granulosum that thrive in oily environments and are associated with higher sebum production
              </li>
              <li>
                <span className="font-medium">Negative Contributors:</span> Bacteria like Staphylococcus aureus, 
                Corynebacterium kroppenstedtii, and Staphylococcus epidermidis that prefer drier environments 
                and are associated with lower sebum production
              </li>
            </ul>
            <p>
              The score ranges from 0-100, where:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><span className="font-medium">0-30:</span> Very dry skin with low sebum production</li>
              <li><span className="font-medium">31-60:</span> Normal sebum production with balanced oil levels</li>
              <li><span className="font-medium">61-100:</span> Oily skin with high sebum production</li>
            </ul>
            <p>
              Understanding your sebum index can help you choose appropriate skincare products and routines. 
              Those with higher scores may benefit from oil-controlling ingredients, while those with lower scores 
              may need more hydrating and moisturizing products to maintain skin barrier function.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSensitivityExplanation} onOpenChange={setShowSensitivityExplanation}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Skin Sensitivity Score Explanation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <p>
              Your Skin Sensitivity Score measures your skin's resilience to irritants and environmental 
              stressors based on your microbiome composition. This score takes into account the presence 
              and abundance of bacteria that either protect against or contribute to skin sensitivity.
            </p>
            <p>
              The score is calculated using a weighted system that considers:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-medium">Positive Contributors:</span> Bacteria like Staphylococcus epidermidis 
                and Staphylococcus hominis that help protect against sensitivity
              </li>
              <li>
                <span className="font-medium">Negative Contributors:</span> Bacteria like Staphylococcus aureus, 
                Staphylococcus haemolyticus, and Corynebacterium kroppenstedtii that may increase skin sensitivity
              </li>
            </ul>
            <p>
              A higher score indicates:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Better tolerance to skincare products</li>
              <li>Reduced likelihood of irritation</li>
              <li>More resilient skin barrier</li>
              <li>Better protection against environmental stressors</li>
            </ul>
            <p>
              The score is normalized to a 0-100 scale, where higher scores indicate better skin resilience 
              and lower sensitivity. This score can help guide your skincare choices and help you understand 
              how your skin's microbiome composition affects its sensitivity to various factors.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

