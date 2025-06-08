export type BacteriaPercentages = {
  'C.Acne': number;
  'C.Stri': number;
  'S.Cap': number;
  'S.Epi': number;
  'C.Avi': number;
  'C.gran': number;
  'S.haem': number;
  'S.Aur': number;
  'C.Tub': number;
  'S.hom': number;
  'C.Krop': number;
};

export const calculateHydrationScore = (age: number, bacteriaPercentages: Record<string, number>) => {
  // Define optimal ranges based on age
  const optimalRanges = {
    'C.Acne': age < 40 ? [65, 85] : [30, 50],
    'S.Epi': age < 40 ? [5, 7] : [10, 14],
    'C.Krop': age < 40 ? [0, 4] : [10, 16],
    'S.Cap': [0, 5],
    'S.Aur': [0, 1],
    'C.Stri': [0, 5],
    'C.Tub': [0, 0.5],
    'C.Avi': [0, 5],
    'C.gran': [0, 1],
    'S.haem': [0, 1],
    'S.hom': [0, 1],
  };

  // Assign hydration weights
  const hydrationWeights = {
    'C.Acne': 2.0,
    'S.Epi': 2.0,
    'C.Krop': -1.5,
    'S.Cap': -0.5,
    'S.Aur': -2.0,
    'C.Stri': -1.0,
    'C.Tub': -2.0,
    'C.Avi': -0.5,
    'C.gran': -1.0,
    'S.haem': -1.5,
    'S.hom': 0.5,
  };

  let score = 0;
  let maxScore = 0;

  for (const [bacterium, percent] of Object.entries(bacteriaPercentages)) {
    const weight = hydrationWeights[bacterium as keyof typeof hydrationWeights] || 0;
    const optRange = optimalRanges[bacterium as keyof typeof optimalRanges] || [0, 0];
    const [minOpt, maxOpt] = optRange;

    // Calculate penalty or bonus
    if (percent < minOpt) {
      const deviation = (minOpt - percent) / minOpt;
      score += weight * (1 - deviation);
    } else if (percent > maxOpt) {
      const deviation = (percent - maxOpt) / maxOpt;
      score += weight * (1 - deviation);
    } else {
      score += weight * 1.0; // Fully within optimal range
    }

    maxScore += Math.abs(weight);
  }

  // Normalize score to 0–100
  // First, shift the score to be positive by adding maxScore
  const shiftedScore = score + maxScore;
  // Then normalize to 0-100 range
  const normalized = (shiftedScore / (2 * maxScore)) * 100;
  // Ensure the score is within 0-100 range
  const clampedScore = Math.max(0, Math.min(100, normalized));
  return Math.round(clampedScore * 100) / 100;
};

export const calculateMicrobiomeScore = (age: number, bacteriaPercentages: Record<string, number>) => {
  // Use the same optimal ranges as hydration score
  const optimalRanges = {
    'C.Acne': age < 40 ? [65, 85] : [30, 50],
    'S.Epi': age < 40 ? [5, 7] : [10, 14],
    'C.Krop': age < 40 ? [0, 4] : [10, 16],
    'S.Cap': [0, 5],
    'S.Aur': [0, 1],
    'C.Stri': [0, 5],
    'C.Tub': [0, 0.5],
    'C.Avi': [0, 5],
    'C.gran': [0, 1],
    'S.haem': [0, 1],
    'S.hom': [0, 1],
  };

  let totalPenalty = 0;
  let diversityPenalty = 0;

  for (const [bacterium, percent] of Object.entries(bacteriaPercentages)) {
    // Calculate diversity penalty for any bacteria over 80%
    if (percent > 80) {
      diversityPenalty += percent - 80;
    }

    // Calculate optimal range penalties
    const optRange = optimalRanges[bacterium as keyof typeof optimalRanges] || [0, 0];
    const [minOpt, maxOpt] = optRange;

    if (percent < minOpt) {
      totalPenalty += (minOpt - percent) / 2.5;
    } else if (percent > maxOpt) {
      totalPenalty += (percent - maxOpt) / 2.5;
    }
  }

  // Calculate final score
  const microbiomeScore = Math.max(0, 100 - totalPenalty - diversityPenalty);
  
  return Math.round(microbiomeScore * 100) / 100;
};

export const classifySkinType = (score: number): string => {
  if (score < 35) {
    return "Dry";
  } else if (score < 55) {
    return "Combination";
  } else if (score < 75) {
    return "Healthy";
  } else {
    return "Oily";
  }
};

export const estimateAge = (bacteriaPercentages: Record<string, number>): number => {
  // Midpoints from reference ranges
  const ageAnchors = {
    'C.Acne': { young: 74, old: 37 },
    'S.Epi': { young: 5, old: 12 },
    'C.Krop': { young: 2, old: 13 },
    'C.Tub': { young: 0.3, old: 0.5 },
    'C.gran': { young: 0.8, old: 0.2 }
  };

  // Age weights (how much each shifts the predicted age)
  const ageWeights = {
    'C.Acne': -3.5,
    'S.Epi': +3.0,
    'C.Krop': +2.5,
    'C.Tub': +2.0,
    'C.gran': -1.5
  };

  let totalShift = 0;
  let totalWeight = 0;
  const baselineAge = 40; // neutral midpoint

  for (const [bacterium, anchors] of Object.entries(ageAnchors)) {
    const weight = ageWeights[bacterium as keyof typeof ageWeights];
    const observed = bacteriaPercentages[bacterium] || 0;
    const youngVal = anchors.young;
    const oldVal = anchors.old;

    // Expected range delta
    const expectedRange = Math.abs(oldVal - youngVal);
    if (expectedRange === 0) {
      continue; // avoid divide-by-zero
    }

    // Directional deviation: -1 = like young, +1 = like old
    let deviation = (observed - youngVal) / expectedRange;
    deviation = Math.max(Math.min(deviation, 1), -1); // clamp between -1 and 1

    // Multiply by weight and sum
    const shift = deviation * weight;
    totalShift += shift;
    totalWeight += Math.abs(weight);
  }

  // Normalize and apply to baseline
  const ageEstimate = baselineAge + (totalShift / totalWeight) * 25; // 25 = max age deviation from 40

  // Clamp result
  return Math.max(10, Math.min(85, Math.round(ageEstimate * 10) / 10));
};

export function calculateAntioxidantScore(bacteriaPercentages: BacteriaPercentages): number {
  // Antioxidant weights based on direction and magnitude of effect
  const antioxidantWeights = {
    'C.Acne': -0.5,
    'S.Epi': 2.0,
    'C.Krop': -2.0,
    'S.Cap': -0.5,
    'S.Aur': -2.0,
    'C.Stri': -1.5,
    'C.Tub': -1.0,
    'C.Avi': 0.0,
    'C.gran': 0.5,
    'S.haem': -2.0,
    'S.hom': 0.5
  };

  // Normalize by scaling bacteria % (0–100) into contribution to antioxidant score
  let score = 0;
  let maxScore = 0;

  for (const [bacterium, weight] of Object.entries(antioxidantWeights)) {
    const percent = bacteriaPercentages[bacterium as keyof BacteriaPercentages] || 0;
    // Cap influence of each microbe at 10% abundance for scoring
    const cappedPercent = Math.min(percent, 10) / 10.0;  // Normalize to 0–1
    score += cappedPercent * weight;
    maxScore += Math.abs(weight);  // For normalization
  }

  // Normalize to 0–100 score
  const normalized = (score + maxScore) / (2 * maxScore) * 100;
  return Math.round(normalized * 100) / 100;  // Round to 2 decimal places
} 