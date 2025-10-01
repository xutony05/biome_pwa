'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Dynamic route handler for bacteria pages
 * This component handles URLs like /bacteria/C.Gran and redirects them to the correct static routes
 * 
 * The mapping logic converts abbreviated bacteria names to their full route names:
 * - C.Gran -> granulosum
 * - C.Acne -> acnes
 * - C.Stri -> striatum
 * - S.Haem -> haemolyticus
 * - S.Hom -> hominis
 * etc.
 */
export default function DynamicBacteriaPage() {
  const params = useParams();
  const router = useRouter();

  // Mapping from abbreviated bacteria names to their route names
  // Updated to use proper capitalization: C.Gran, S.Haem, S.Hom
  const bacteriaRouteMap: { [key: string]: string } = {
    'C.Acne': 'acnes',
    'C.Stri': 'striatum', 
    'S.Cap': 'capitis',
    'S.Epi': 'epidermidis',
    'C.Avi': 'avidum',
    'C.Gran': 'granulosum',  // This handles the C.Gran -> granulosum redirect
    'S.Haem': 'haemolyticus', // Updated from S.haem to S.Haem
    'S.Aur': 'aureus',
    'C.Tub': 'tuberculostearicum',
    'S.Hom': 'hominis',      // Updated from S.hom to S.Hom
    'C.Krop': 'kroppenstedtii'
  };

  useEffect(() => {
    const slug = params.slug as string;
    
    // Check if this is an abbreviated bacteria name that needs redirecting
    if (bacteriaRouteMap[slug]) {
      // Redirect to the correct static route
      router.replace(`/bacteria/${bacteriaRouteMap[slug]}`);
    } else {
      // If it's not a known abbreviation, redirect to 404 or home
      router.replace('/');
    }
  }, [params.slug, router]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}
