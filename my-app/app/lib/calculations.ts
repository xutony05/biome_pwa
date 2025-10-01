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

// --- Configuration Constants for Hydration Score ---

// Maximum points (weights) for each species in the new algorithm
const HYDRATION_WEIGHTS = {
    'S. epidermidis': 35,
    'S. hominis': 25,
    'C. acnes': 22,
    // Binary-scored species (3 points each)
    'S. capitis': 3,
    'S. haemolyticus': 3,
    'C. striatum': 3,
    'C. avidum': 3,
    'C. granulosum': 3,
    'C. tuberculostearicum': 3,
    // Deduction-only species
    'C. kroppenstedtii': 0, 
    'S. aureus': 0,
};

// Optimal Ranges for Binary/Deduction species
const HYDRATION_OPTIMAL_RANGES = {
    'young': { // Under 40
        'C. kroppenstedtii': { min: 1, max: 5 },
        'S. capitis': { min: 0, max: 5 },
        'C. striatum': { min: 0, max: 5 },
        'C. avidum': { min: 0, max: 5 },
        'C. tuberculostearicum': { min: 0.1, max: 0.5 },
        'C. granulosum': { min: 0, max: 1 },
        'S. haemolyticus': { min: 0, max: 1 },
        'S. aureus': { min: 0, max: 1 },
    },
    'old': { // 40 and older
        'C. kroppenstedtii': { min: 10, max: 15 },
        'S. capitis': { min: 0, max: 5 },
        'C. striatum': { min: 0, max: 5 },
        'C. avidum': { min: 0, max: 5 },
        'C. tuberculostearicum': { min: 0.1, max: 0.5 },
        'C. granulosum': { min: 0, max: 1 },
        'S. haemolyticus': { min: 0, max: 1 },
        'S. aureus': { min: 0, max: 1 },
    },
};

// Complex Scoring Rules (Non-linear, Directional, Capped)
const HYDRATION_COMPLEX_SCORING_RULES = {
    'young': {
        'S. epidermidis': { optimal: 5, capAbove: 30 }, // CapAbove applies to actual >= capAbove
        'C. acnes': { optimal: 74, capBelow: 40 },      // CapBelow applies to actual <= capBelow
        'S. hominis': { optimal: 1, capAbove: 10 },     // CapAbove applies to actual >= capAbove
    },
    'old': {
        'S. epidermidis': { optimal: 12, capAbove: 35 },
        'C. acnes': { optimal: 40, capBelow: 20 },
        'S. hominis': { optimal: 1, capAbove: 10 },
    },
};

// Mapping from existing bacteria names to new algorithm names
const BACTERIA_NAME_MAPPING = {
    'S.Epi': 'S. epidermidis',
    'S.hom': 'S. hominis', 
    'C.Acne': 'C. acnes',
    'S.Cap': 'S. capitis',
    'S.haem': 'S. haemolyticus',
    'C.Stri': 'C. striatum',
    'C.Avi': 'C. avidum',
    'C.gran': 'C. granulosum',
    'C.Tub': 'C. tuberculostearicum',
    'C.Krop': 'C. kroppenstedtii',
    'S.Aur': 'S. aureus',
};

/**
 * Checks if a value is within a range (inclusive).
 * This helper function determines if a bacterial abundance falls within the optimal range.
 */
const isWithinRange = (value: number, minVal: number, maxVal: number): boolean => {
    return value >= minVal && value <= maxVal;
};

/**
 * Calculates the Hydration Score based on provided bacterial abundances and age group.
 * This function implements a complex scoring algorithm that considers:
 * - Non-linear scoring for major species (S. epidermidis, C. acnes, S. hominis)
 * - Binary scoring for secondary species (3 points if in optimal range, 0 otherwise)
 * - Deduction penalties for harmful species (C. kroppenstedtii, S. aureus)
 * 
 * @param age - The person's age (used to determine if they're 'young' < 40 or 'old' >= 40)
 * @param bacteriaPercentages - Dictionary mapping bacterial names to their percentage abundance
 * @returns A dictionary containing the final score and detailed breakdown
 */
export const calculateHydrationScore = (age: number, bacteriaPercentages: Record<string, number>) => {
    // Determine age group for scoring rules
    const ageGroup = age < 40 ? 'young' : 'old';
    
    // Convert bacteria names from existing format to new algorithm format
    const abundances: Record<string, number> = {};
    for (const [oldName, percentage] of Object.entries(bacteriaPercentages)) {
        const newName = BACTERIA_NAME_MAPPING[oldName as keyof typeof BACTERIA_NAME_MAPPING];
        if (newName && percentage !== undefined && percentage !== null) {
            abundances[newName] = parseFloat(percentage.toString()) || 0.0;
        }
    }
    
    let earnedPoints = 0;
    let deductions = 0;
    const currentOR = HYDRATION_OPTIMAL_RANGES[ageGroup];
    const currentCR = HYDRATION_COMPLEX_SCORING_RULES[ageGroup];
    const scoreDetails: Record<string, { points: number; calculation: string }> = {};

    // --- 1. Complex Non-Linear Species Scoring (S. epidermidis, C. acnes, S. hominis) ---
    const complexSpecies = ['S. epidermidis', 'S. hominis', 'C. acnes'];

    for (const name of complexSpecies) {
        const weight = HYDRATION_WEIGHTS[name as keyof typeof HYDRATION_WEIGHTS];
        const actual = abundances[name] || 0.0;
        const rules = currentCR[name as keyof typeof currentCR];
        const optimal = rules.optimal;

        let points = 0;
        let effectiveDenominator = 0;
        let hardCapExceeded = false;
        const deviation = Math.abs(actual - optimal);

        if (name === 'S. epidermidis') {
            // Hard Cap: Actual >= capAbove results in 0 points
            const capAbove = (rules as { capAbove: number }).capAbove;
            if (actual >= capAbove) { 
                hardCapExceeded = true;
            } else if (actual > optimal) {
                // Above optimal: Denominator is capAbove
                effectiveDenominator = capAbove;
            } else {
                // Below optimal: Denominator is optimal
                effectiveDenominator = optimal;
            }
        
        } else if (name === 'C. acnes') {
            // Hard Cap: Actual <= capBelow results in 0 points
            const capBelow = (rules as { capBelow: number }).capBelow;
            if (actual <= capBelow) {
                hardCapExceeded = true;
            } else if (actual < optimal) {
                // Below optimal: Denominator is capBelow
                effectiveDenominator = capBelow;
            } else {
                // Above optimal: Denominator is optimal
                effectiveDenominator = optimal;
            }
        } else if (name === 'S. hominis') {
            // Hard Cap: Actual >= capAbove results in 0 points
            const capAbove = (rules as { capAbove: number }).capAbove;
            if (actual >= capAbove) {
                hardCapExceeded = true;
            } else if (actual > optimal) {
                // Above optimal: Denominator is capAbove
                effectiveDenominator = capAbove;
            } else {
                // Below optimal: Denominator is optimal
                effectiveDenominator = optimal;
            }
        }

        let calculation = "";
        if (hardCapExceeded) {
            points = 0;
            calculation = `Hard cap exceeded (Actual: ${actual}%) - Points: 0`;
        } else {
            // Calculate penalty factor (0 to 1)
            const penaltyFactor = deviation / effectiveDenominator;
            // Points = Weight * (1 - Penalty Factor). Clamped at 0.
            points = Math.max(0, weight * (1 - penaltyFactor));
            calculation = (
                `Weight (${weight}) * Math.max(0, 1 - (|${actual} - ${optimal}| / ${effectiveDenominator})) `
                + `= ${points.toFixed(2)} pts`
            );
        }
        
        earnedPoints += points;
        scoreDetails[name] = { points: points, calculation: calculation };
    }

    // --- 2. Binary Species Scoring (3 points each) ---
    const binarySpecies = [
        'S. capitis', 'S. haemolyticus', 'C. striatum', 
        'C. avidum', 'C. granulosum', 'C. tuberculostearicum'
    ];
    
    for (const name of binarySpecies) {
        const weight = HYDRATION_WEIGHTS[name as keyof typeof HYDRATION_WEIGHTS]; // 3 points
        const actual = abundances[name] || 0.0;
        const rangeLimits = currentOR[name as keyof typeof currentOR];
        
        const isInRange = isWithinRange(actual, rangeLimits.min, rangeLimits.max);
        const points = isInRange ? weight : 0;
        
        earnedPoints += points;
        scoreDetails[name] = {
            points: points,
            calculation: `Actual ${actual}% is ${isInRange ? 'in' : 'out of'} [${rangeLimits.min}-${rangeLimits.max}%]. Points: ${points}`
        };
    }

    // --- 3. Deduction-Only Species Scoring ---
    
    // C. kroppenstedtii deduction (10 points flat deduction if out of range)
    const Ck = abundances['C. kroppenstedtii'] || 0.0;
    const CkRange = currentOR['C. kroppenstedtii'];
    const CkInRange = isWithinRange(Ck, CkRange.min, CkRange.max);
    
    const CkDeduction = CkInRange ? 0 : 10;
    deductions += CkDeduction;
    scoreDetails['C. kroppenstedtii'] = { 
        points: -CkDeduction, 
        calculation: `Actual ${Ck}% is ${CkInRange ? 'in' : 'out of'} [${CkRange.min}-${CkRange.max}%]. Deduction: ${CkDeduction} pts` 
    };

    // S. aureus deduction (20 points flat deduction if out of range)
    const Sa = abundances['S. aureus'] || 0.0;
    const SaRange = currentOR['S. aureus'];
    const SaInRange = isWithinRange(Sa, SaRange.min, SaRange.max);
    
    const SaDeduction = SaInRange ? 0 : 20;
    deductions += SaDeduction;
    scoreDetails['S. aureus'] = { 
        points: -SaDeduction, 
        calculation: `Actual ${Sa}% is ${SaInRange ? 'in' : 'out of'} [${SaRange.min}-${SaRange.max}%]. Deduction: ${SaDeduction} pts` 
    };

    // --- 4. Final Score Calculation ---
    const rawScore = earnedPoints - deductions;
    const finalScore = Math.min(100, Math.max(0, rawScore)); // Clamp between 0 and 100

    return Math.round(finalScore);
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
  
  return Math.round(microbiomeScore);
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
  return Math.round(normalized);  // Return integer
}

export function calculateFirmnessScore(bacteriaPercentages: BacteriaPercentages): number {
  const weights = {
    'S.Epi': 2.0,
    'C.gran': 1.0,
    'C.Krop': -2.0,
    'S.Aur': -2.0,
    'C.Tub': -1.5,
    'S.haem': -1.5
  };

  let score = 0;
  let maxScore = 0;

  for (const [bacterium, weight] of Object.entries(weights)) {
    const percent = bacteriaPercentages[bacterium as keyof BacteriaPercentages] || 0;
    // Cap influence of each microbe at 10% abundance for scoring
    const cappedPercent = Math.min(percent, 10) / 10.0;  // Normalize to 0–1
    score += cappedPercent * weight;
    maxScore += Math.abs(weight);  // For normalization
  }

  // Normalize to 0–100 score
  const normalized = (score + maxScore) / (2 * maxScore) * 100;
  return Math.round(normalized);  // Return integer
}

export function calculateSensitivityScore(bacteriaPercentages: BacteriaPercentages): number {
  const weights = {
    'S.Aur': -2.5,
    'S.haem': -2.0,
    'C.Krop': -1.5,
    'C.Stri': -1.0,
    'S.hom': 1.5,
    'S.Epi': 2.0
  };

  let score = 0;
  let maxScore = 0;

  for (const [bacterium, weight] of Object.entries(weights)) {
    const percent = bacteriaPercentages[bacterium as keyof BacteriaPercentages] || 0;
    // Cap influence of each microbe at 10% abundance for scoring
    const cappedPercent = Math.min(percent, 10) / 10.0;  // Normalize to 0–1
    score += cappedPercent * weight;
    maxScore += Math.abs(weight);  // For normalization
  }

  // Normalize to 0–100 score
  const normalized = (score + maxScore) / (2 * maxScore) * 100;
  return Math.round(normalized);  // Return integer
}
