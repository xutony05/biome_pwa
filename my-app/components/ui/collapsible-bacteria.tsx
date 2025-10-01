'use client';

import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from 'next/navigation';
import optimalRanges from '@/dataAssets/optimal.json';

// Add mapping for database names to description names
const bacteriaNameMap: Record<string, string> = {
  'C.Acne': 'C. acnes',
  'C.Stri': 'C. striatum',
  'S.Cap': 'S. capitis',
  'S.Epi': 'S. epidermidis',
  'C.Avi': 'C. avidum',
  'C.Gran': 'C. granulosum',
  'S.Haem': 'S. haemolyticus',
  'S.Aur': 'S. aureus',
  'C.Tub': 'C. tuberculostearicum',
  'S.Hom': 'S. hominis',
  'C.Krop': 'C. kroppenstedtii'
};

interface CollapsibleBacteriaProps {
  bacteria: string;
  value: number;
  status: 'optimal' | 'above' | 'below';
}

export function CollapsibleBacteria({ bacteria, value, status }: CollapsibleBacteriaProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    const bacteriaMap: Record<string, string> = {
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

    const path = bacteriaMap[bacteria];
    if (path) {
      router.push(`/bacteria/${path}`);
    } else {
      setIsOpen(!isOpen);
    }
  };

  // Get optimal range for the bacteria
  const bacteriaKey = bacteriaNameMap[bacteria];
  const range = optimalRanges[bacteriaKey as keyof typeof optimalRanges];
  const [min, max] = range || [0, 100];

  return (
    <div className="space-y-2">
      <button 
        onClick={handleClick}
        className="w-full flex items-center justify-between py-2 hover:bg-accent/50 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            status === 'above' ? "bg-red-500" : 
            status === 'below' ? "bg-amber-500" : 
            "bg-green-500"
          )} />
          <div className="font-medium">{bacteriaNameMap[bacteria] || bacteria}</div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-sm font-medium",
            status === 'above' ? "text-red-500" : 
            status === 'below' ? "text-amber-500" : 
            "text-green-500"
          )}>
            {value.toFixed(1)}%
          </span>
          <ChevronRight 
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-90 transform"
            )} 
          />
        </div>
      </button>
      
      {/* Range visualization */}
      <div className="px-2 pb-6">
        {/* Range scale */}
        <div className="relative h-8 bg-secondary/30 rounded-lg overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-green-500/20 to-red-500/10" />
          
          {/* Optimal range box */}
          <div 
            className="absolute h-full bg-green-500/20 border-2 border-green-500/50"
            style={{
              left: `${(min / 100) * 100}%`,
              width: `${((max - min) / 100) * 100}%`
            }}
          />
          
          {/* Current value indicator */}
          <div 
            className={cn(
              "absolute top-0 bottom-0 w-0.5",
              status === 'above' ? "bg-red-500" : 
              status === 'below' ? "bg-amber-500" : 
              "bg-green-500"
            )}
            style={{
              left: `${(value / 100) * 100}%`
            }}
          >
            {/* Value marker */}
            <div className={cn(
              "absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full shadow-lg",
              status === 'above' ? "bg-red-500" : 
              status === 'below' ? "bg-amber-500" : 
              "bg-green-500"
            )}>
              <div className="absolute inset-0 rounded-full bg-white/20 blur-sm" />
            </div>
          </div>
          
          {/* Scale markers */}
          <div className="absolute inset-x-0 bottom-0 flex justify-between px-1">
            {[0, 25, 50, 75, 100].map((mark) => (
              <div key={mark} className="flex flex-col items-center">
                <div className="w-px h-2 bg-muted-foreground/30" />
                <span className="text-[10px] text-muted-foreground mt-0.5">{mark}%</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Range information */}
        <div className="flex flex-col items-center mt-2 space-y-1">
          {/* Optimal range */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500/20 border-2 border-green-500/50" />
            <span className="text-xs text-muted-foreground">
              Optimal Range: {min}% - {max}%
            </span>
          </div>
          
          {/* Current value status */}
          <div className={cn(
            "text-xs font-medium",
            status === 'above' ? "text-red-500" : 
            status === 'below' ? "text-amber-500" : 
            "text-green-500"
          )}>
            {status === 'above' ? 'Above Optimal' : 
             status === 'below' ? 'Below Optimal' : 
             'Optimal Range'}
          </div>
        </div>
      </div>
    </div>
  );
} 