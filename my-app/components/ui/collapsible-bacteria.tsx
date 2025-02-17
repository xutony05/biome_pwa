'use client';

import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from 'next/navigation';

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
      'C.gran': 'granulosum',
      'S.haem': 'haemolyticus',
      'S.Aur': 'aureus',
      'C.Tub': 'tuberculostearicum',
      'S.hom': 'hominis',
      'C.Krop': 'kroppenstedtii'
    };

    const path = bacteriaMap[bacteria];
    if (path) {
      router.push(`/bacteria/${path}`);
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="space-y-1.5">
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
    </div>
  );
} 