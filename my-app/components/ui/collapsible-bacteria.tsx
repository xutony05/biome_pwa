'use client';

import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import bacteriaDescriptions from "@/dataAssets/bacteriaDescription.json";

// Add mapping for database names to description names
const bacteriaNameMap: Record<string, string> = {
  'C.Acne': 'C. acnes',
  'C.Stri': 'C. striatum',
  'S.Cap': 'S. capitis',
  'S.Epi': 'S. epidermidis',
  'C.Avi': 'C. avidum',
  'C.gran': 'C. granulosum',
  'S.haem': 'S. haemolyticus',
  'S.Aur': 'S. aureus',
  'C.Tub': 'C. tuberculostearicum',
  'S.hom': 'S. hominis',
  'C.Krop': 'C. kroppenstedtii'
};

interface CollapsibleBacteriaProps {
  bacteria: string;
  value: number;
}

export function CollapsibleBacteria({ bacteria, value }: CollapsibleBacteriaProps) {
  const [isOpen, setIsOpen] = useState(false);
  const descriptionKey = bacteriaNameMap[bacteria];
  const description = descriptionKey ? bacteriaDescriptions[descriptionKey as keyof typeof bacteriaDescriptions] : null;

  return (
    <div className="space-y-1.5">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2 hover:bg-accent/50 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span>{bacteria}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{value.toFixed(1)}%</span>
          <ChevronRight 
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-90 transform"
            )} 
          />
        </div>
      </button>
      
      {isOpen && description && (
        <div className="pl-4 pr-2 py-2 text-sm text-muted-foreground bg-accent/50 rounded-lg">
          {description}
        </div>
      )}
    </div>
  );
} 