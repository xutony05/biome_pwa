'use client';

import { Button } from "@/components/ui/button";
import { MainHeader } from "@/components/ui/header";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from 'next/navigation';

export default function ProductRecommendationsExplanation() {
  const router = useRouter();

  // Simple back handler - let the profile page handle scroll restoration
  const handleBack = () => {
    router.back();
  };
  return (
    <div className="bg-gray-50 min-h-screen">
      <MainHeader />
      
      {/* Header Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleBack}
            className="h-10 w-10"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Personalized Product Recommendations</h1>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-8">
        <Card>
          <CardContent className="p-6">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
