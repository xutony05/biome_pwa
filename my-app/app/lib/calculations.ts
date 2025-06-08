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