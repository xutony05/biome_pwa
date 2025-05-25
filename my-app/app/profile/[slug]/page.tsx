'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useState } from 'react';
import { getReportByNumber, type Report } from '@/app/lib/supabase';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { CollapsibleBacteria } from "@/components/ui/collapsible-bacteria";
import optimalRanges from '@/dataAssets/optimal.json';
import codex from '@/dataAssets/codex.json';
import { useBacteria } from '@/app/context/BacteriaContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


const getOptimalRangeStatus = (bacteria: string, value: number) => {
  const bacteriaKey = bacteria
    .replace('C.Acne', 'C. acnes')
    .replace('C.Stri', 'C. striatum')
    .replace('S.Cap', 'S. capitis')
    .replace('S.Epi', 'S. epidermidis')
    .replace('C.Avi', 'C. avidum')
    .replace('C.gran', 'C. granulosum')
    .replace('S.haem', 'S. haemolyticus')
    .replace('S.Aur', 'S. aureus')
    .replace('C.Tub', 'C. tuberculostearicum')
    .replace('S.hom', 'S. hominis')
    .replace('C.Krop', 'C. kroppenstedtii');
  
  const range = optimalRanges[bacteriaKey as keyof typeof optimalRanges];
  if (!range) return 'optimal'; // default to optimal if no range found

  if (value > range[1]) return 'above';
  if (value < range[0]) return 'below';
  return 'optimal';
};

export default function ReportPage() {
  const params = useParams();
  const { user } = useAuth();
  const [report, setReport] = useState<Report | null>(null);
  const { setValues } = useBacteria();
  const [showEnvExplanation, setShowEnvExplanation] = useState(false);
  const [showScoreExplanation, setShowScoreExplanation] = useState(false);
  const [showMicrobesExplanation, setShowMicrobesExplanation] = useState(false);
  
  useEffect(() => {
    async function fetchReport() {
      if (user?.email) {
        const reportData = await getReportByNumber(user.email, Number(params.slug));
        setReport(reportData);
        // Set bacteria values
        console.log(reportData);
        if (reportData) {
          setValues({
            'C.Acne': reportData['C.Acne'],
            'C.Stri': reportData['C.Stri'],
            'S.Cap': reportData['S.Cap'],
            'S.Epi': reportData['S.Epi'],
            'C.Avi': reportData['C.Avi'],
            'C.gran': reportData['C.gran'],
            'S.haem': reportData['S.haem'],
            'S.Aur': reportData['S.Aur'],
            'C.Tub': reportData['C.Tub'],
            'S.hom': reportData['S.hom'],
            'C.Krop': reportData['C.Krop']
          });
        }
      }
    }
    fetchReport();
  }, [params.slug, user?.email, setValues]);

  if (!report) return null;

  const score = report.microbiome_score || 0;

  return (
    <main className="fixed inset-0 flex flex-col">
      {/* Fixed Header */}
      <div className="bg-background z-10 p-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-semibold ml-2">Report #{params.slug}</h1>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">Microbiome Balance Score</h2>
                  <Button 
                    variant="ghost" 
                    className="text-sm text-blue-500 h-auto p-0"
                    onClick={() => setShowScoreExplanation(true)}
                  >
                    EXPLAIN
                  </Button>
                </div>

                <div className="text-2xl font-bold">
                  {score}
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Progress value={score} className="h-2" />
                    <div 
                      className="absolute w-3 h-3 bg-black rounded-full -mt-2.5 transform -translate-x-1/2"
                      style={{ left: `${score}%` }}
                    />
                  </div>
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
                    onClick={() => setShowEnvExplanation(true)}
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

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">Key Microbes</h2>
                  <Button 
                    variant="ghost" 
                    className="text-sm text-blue-500 h-auto p-0"
                    onClick={() => setShowMicrobesExplanation(true)}
                  >
                    EXPLAIN
                  </Button>
                </div>

                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span>Optimal Range</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span>Above Optimal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <span>Below Optimal</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {Object.entries(report)
                    .filter(([key, value]) => key.includes('.') && value !== null)
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .map(([bacteria, value]) => {
                      const status = getOptimalRangeStatus(bacteria, value as number);
                      return (
                        <CollapsibleBacteria 
                          key={bacteria}
                          bacteria={bacteria}
                          value={value as number}
                          status={status}
                        />
                      );
                    })}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">Recommendations</h2>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-accent rounded-lg">
                    <h3 className="font-medium mb-2">Ingredients to Look Out For</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-green-600 mb-2">Recommended Ingredients</h4>
                        <ul className="list-disc list-inside space-y-2">
                          {report.good_ingredients?.map((ingredient: string, index: number) => (
                            <li key={index} className="space-y-1">
                              <span className="font-medium text-primary">{ingredient}</span>
                              <p className="ml-6 text-sm text-muted-foreground">
                                {codex.ingredients[ingredient as keyof typeof codex.ingredients]}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-red-600 mb-2">Ingredients to Avoid</h4>
                        <ul className="list-disc list-inside space-y-2">
                          {report.avoid_ingredients?.map((ingredient: string, index: number) => (
                            <li key={index} className="space-y-1">
                              <span className="font-medium text-red-600">{ingredient}</span>
                              <p className="ml-6 text-sm text-muted-foreground">
                                {codex.ingredients[ingredient as keyof typeof codex.ingredients]}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-accent rounded-lg">
                    <h3 className="font-medium mb-2">Dietary Recommendations</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-green-600 mb-2">Foods to Include</h4>
                        <ul className="list-disc list-inside space-y-2">
                          {report.good_food?.map((food: string, index: number) => (
                            <li key={index} className="space-y-1">
                              <span className="font-medium text-primary">{food}</span>
                              <p className="ml-6 text-sm text-muted-foreground">
                                {codex.diet[food as keyof typeof codex.diet]}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-red-600 mb-2">Foods to Avoid</h4>
                        <ul className="list-disc list-inside space-y-2">
                          {report.avoid_food?.map((food: string, index: number) => (
                            <li key={index} className="space-y-1">
                              <span className="font-medium text-red-600">{food}</span>
                              <p className="ml-6 text-sm text-muted-foreground">
                                {codex.diet[food as keyof typeof codex.diet]}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-accent rounded-lg">
                    <h3 className="font-medium mb-2">Lifestyle Tips</h3>
                    <ul className="list-disc list-inside space-y-2">
                      {report.lifestyle?.map((tip: string, index: number) => (
                        <li key={index} className="space-y-1">
                          <span className="font-medium text-primary">{tip}</span>
                          <p className="ml-6 text-sm text-muted-foreground">
                            {codex.lifestyle[tip as keyof typeof codex.lifestyle]}
                          </p>
                        </li>
                      ))}
                    </ul>
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
    </main>
  );
}
