'use client';

import { useParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useState } from 'react';
import { getReportByNumber, type Report } from '@/app/lib/supabase';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CheckCircle2, XCircle, Leaf, Apple, Heart, ShoppingBag, ExternalLink } from "lucide-react";
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
  const [showProductsExplanation, setShowProductsExplanation] = useState(false);
  
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
                  <h2 className="text-lg font-medium">Recommended Products</h2>
                  <Button 
                    variant="ghost" 
                    className="text-sm text-blue-500 h-auto p-0"
                    onClick={() => setShowProductsExplanation(true)}
                  >
                    EXPLAIN
                  </Button>
                </div>

                {report.products ? (
                  <div className="p-6 bg-accent/50 rounded-lg border border-accent hover:border-primary/50 transition-colors duration-200">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <ShoppingBag className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold">Personalized Product</h3>
                    </div>
                    <div className="grid gap-6">
                      {/* Value Products */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Best Value Products</h3>
                        <div className="grid gap-4">
                          {[
                            {
                              name: report.products.value_1_name,
                              price: report.products.value_1_price,
                              image: report.products.value_1_image,
                              url: report.products.value_1_url
                            },
                            {
                              name: report.products.value_2_name,
                              price: report.products.value_2_price,
                              image: report.products.value_2_image,
                              url: report.products.value_2_url
                            },
                            {
                              name: report.products.value_3_name,
                              price: report.products.value_3_price,
                              image: report.products.value_3_image,
                              url: report.products.value_3_url
                            }
                          ].map((product, index) => (
                            product.name && (
                              <div key={`value-${index}`} className="bg-background/50 rounded-lg p-4 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors duration-200">
                                <div className="flex items-start gap-4">
                                  {product.image && (
                                    <div className="relative w-24 h-24 flex-shrink-0">
                                      <img 
                                        src={product.image} 
                                        alt={product.name}
                                        className="w-full h-full object-contain rounded-lg shadow-md bg-white"
                                      />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-emerald-500 text-lg mb-1">
                                      {product.name}
                                    </h4>
                                    <p className="text-sm text-muted-foreground mb-3">
                                      ${product.price.toFixed(2)}
                                    </p>
                                    {product.url && (
                                      <a 
                                        href={product.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600 transition-colors duration-200"
                                      >
                                        View Product
                                        <ExternalLink className="h-3 w-3" />
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          ))}
                        </div>
                      </div>

                      {/* Quality Products */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Premium Quality Products</h3>
                        <div className="grid gap-4">
                          {[
                            {
                              name: report.products.quality_1_name,
                              price: report.products.quality_1_price,
                              image: report.products.quality_1_image,
                              url: report.products.quality_1_url
                            },
                            {
                              name: report.products.quality_2_name,
                              price: report.products.quality_2_price,
                              image: report.products.quality_2_image,
                              url: report.products.quality_2_url
                            },
                            {
                              name: report.products.quality_3_name,
                              price: report.products.quality_3_price,
                              image: report.products.quality_3_image,
                              url: report.products.quality_3_url
                            }
                          ].map((product, index) => (
                            product.name && (
                              <div key={`quality-${index}`} className="bg-background/50 rounded-lg p-4 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors duration-200">
                                <div className="flex items-start gap-4">
                                  {product.image && (
                                    <div className="relative w-24 h-24 flex-shrink-0">
                                      <img 
                                        src={product.image} 
                                        alt={product.name}
                                        className="w-full h-full object-contain rounded-lg shadow-md bg-white"
                                      />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-emerald-500 text-lg mb-1">
                                      {product.name}
                                    </h4>
                                    <p className="text-sm text-muted-foreground mb-3">
                                      ${product.price.toFixed(2)}
                                    </p>
                                    {product.url && (
                                      <a 
                                        href={product.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600 transition-colors duration-200"
                                      >
                                        View Product
                                        <ExternalLink className="h-3 w-3" />
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          ))}
                        </div>
                      </div>

                      {/* Luxury Products */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Luxury Products</h3>
                        <div className="grid gap-4">
                          {[
                            {
                              name: report.products.luxury_1_name,
                              price: report.products.luxury_1_price,
                              image: report.products.luxury_1_image,
                              url: report.products.luxury_1_url
                            },
                            {
                              name: report.products.luxury_2_name,
                              price: report.products.luxury_2_price,
                              image: report.products.luxury_2_image,
                              url: report.products.luxury_2_url
                            },
                            {
                              name: report.products.luxury_3_name,
                              price: report.products.luxury_3_price,
                              image: report.products.luxury_3_image,
                              url: report.products.luxury_3_url
                            }
                          ].map((product, index) => (
                            product.name && (
                              <div key={`luxury-${index}`} className="bg-background/50 rounded-lg p-4 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors duration-200">
                                <div className="flex items-start gap-4">
                                  {product.image && (
                                    <div className="relative w-24 h-24 flex-shrink-0">
                                      <img 
                                        src={product.image} 
                                        alt={product.name}
                                        className="w-full h-full object-contain rounded-lg shadow-md bg-white"
                                      />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-emerald-500 text-lg mb-1">
                                      {product.name}
                                    </h4>
                                    <p className="text-sm text-muted-foreground mb-3">
                                      ${product.price.toFixed(2)}
                                    </p>
                                    {product.url && (
                                      <a 
                                        href={product.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600 transition-colors duration-200"
                                      >
                                        View Product
                                        <ExternalLink className="h-3 w-3" />
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
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
            <DialogTitle>Recommended Products Explanation</DialogTitle>
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
    </main>
  );
}
