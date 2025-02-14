import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleBacteriaProps {
  bacteria: string;
  value: number;
  isOutsideRange: boolean;
}

export function CollapsibleBacteria({ bacteria, value, isOutsideRange }: CollapsibleBacteriaProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (bacteria.toLowerCase().includes('c.acne')) {
      router.push('/bacteria/acnes');
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
            isOutsideRange ? "bg-red-500" : "bg-green-500"
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