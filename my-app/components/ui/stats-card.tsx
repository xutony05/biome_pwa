import * as React from "react";
import { Card, CardContent } from "./card";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  explanation?: string;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function StatsCard({ 
  title, 
  explanation = "No explanation available",
  icon, 
  className,
  children,
  ...props 
}: StatsCardProps) {
  return (
    <Card 
      className={cn(
        "rounded-2xl h-fit", // h-fit for content hugging
        className
      )} 
      {...props}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {/* Placeholder icon with exact 18x18 size */}
            {icon || (
              <div className="w-[18px] h-[18px] flex-shrink-0">
                <div className="flex gap-0.5">
                  <div className="w-2 h-2 rounded-full bg-green-200" />
                  <div className="w-2 h-2 rounded-full bg-green-200" />
                  <div className="w-2 h-2 rounded-full bg-green-200" />
                  <div className="w-2 h-2 rounded-full bg-green-200" />
                </div>
              </div>
            )}
            <h2 className="text-[18px] leading-[18px] font-normal">{title}</h2>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 text-gray-500 cursor-pointer">
                  <span className="text-xs uppercase">Explain</span>
                  <Info className="w-5 h-5" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{explanation}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {/* Placeholder or actual content */}
        {children || (
          <div className="w-full h-80 bg-gray-200 rounded-lg" />
        )}
      </CardContent>
    </Card>
  );
} 