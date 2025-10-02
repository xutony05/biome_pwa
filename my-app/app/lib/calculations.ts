export type BacteriaPercentages = {
  'C.Acne': number;
  'C.Stri': number;
  'S.Cap': number;
  'S.Epi': number;
  'C.Avi': number;
  'C.Gran': number;
  'S.Haem': number;
  'S.Aur': number;
  'C.Tub': number;
  'S.Hom': number;
  'C.Krop': number;
};

/**
 * Normalizes bacteria percentages to sum to 100, excluding "other" bacteria.
 * This function ensures that all bacteria percentages are proportionally scaled
 * to total 100% while maintaining their relative ratios.
 * 
 * @param bacteriaData - Object containing bacterial species percentages
 * @returns Normalized bacteria percentages that sum to 100
 */
export const normalizeBacteriaPercentages = (bacteriaData: Record<string, number>): Record<string, number> => {
  // Create a copy of the input data to avoid mutating the original
  const normalizedData: Record<string, number> = {};
  
  // Calculate the total percentage excluding "other" bacteria
  let totalPercentage = 0;
  const bacteriaKeys = Object.keys(bacteriaData);
  
  // Sum all bacteria percentages except "other" (case-insensitive)
  for (const [key, value] of Object.entries(bacteriaData)) {
    const normalizedKey = key.toLowerCase();
    // Skip "other" bacteria from normalization
    if (normalizedKey !== 'other' && normalizedKey !== 'others') {
      const percentage = parseFloat(value.toString()) || 0;
      totalPercentage += percentage;
      normalizedData[key] = percentage;
    }
  }
  
  // If total is 0 or very small, return zeros to avoid division by zero
  if (totalPercentage <= 0.01) {
    for (const key of bacteriaKeys) {
      const normalizedKey = key.toLowerCase();
      if (normalizedKey !== 'other' && normalizedKey !== 'others') {
        normalizedData[key] = 0;
      }
    }
    return normalizedData;
  }
  
  // Normalize each bacteria percentage to sum to 100
  for (const [key, value] of Object.entries(normalizedData)) {
    const percentage = parseFloat(value.toString()) || 0;
    // Scale each percentage proportionally to make total = 100
    normalizedData[key] = Math.round((percentage / totalPercentage) * 100 * 100) / 100; // Round to 2 decimal places
  }
  
  return normalizedData;
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
    'S.Hom': 'S. hominis', 
    'C.Acne': 'C. acnes',
    'S.Cap': 'S. capitis',
    'S.Haem': 'S. haemolyticus',
    'C.Stri': 'C. striatum',
    'C.Avi': 'C. avidum',
    'C.Gran': 'C. granulosum',
    'C.Tub': 'C. tuberculostearicum',
    'C.Krop': 'C. kroppenstedtii',
    'S.Aur': 'S. aureus',
};

// --- Age Estimation Configuration Constants ---

const MAX_DEVIATION_YEARS = 10;
const AGE_MIN_INTERPOLATION = 18; // Start age for biomarker interpolation
const AGE_MAX_INTERPOLATION = 88; // End age for biomarker interpolation
const AGE_MIN_CONSTRAINT_THRESHOLD = 16;

// Core markers for age prediction with their percentage ranges at different ages
const CORE_MARKERS = [
    // Marker configuration: { min_pct (at 18 yrs), max_pct (at 88 yrs) }
    { key: 'cAcnes', min_pct: 85, max_pct: 30 },
    { key: 'sEpidermidis', min_pct: 3, max_pct: 23 },
    { key: 'cKroppenstedtii', min_pct: 1, max_pct: 25 }
];

// Diversity Adjustment Algorithm (DAA) constants
const DAA_CONSTANTS = {
    H_MIN: 1.0, 
    H_MAX: 1.8,
    DAA_MIN: -5,
    DAA_MAX: 5 
};

// Mapping from existing bacteria names to age estimation algorithm names
const AGE_BACTERIA_MAPPING = {
    'C.Acne': 'cAcnes',
    'S.Epi': 'sEpidermidis',
    'C.Krop': 'cKroppenstedtii',
    'S.Hom': 'sHominis',
    'S.Cap': 'sCapitis',
    'S.Aur': 'sAureus',
    'C.Stri': 'cStriatum',
    'C.Tub': 'cTuberculostearicum',
    'C.Avi': 'cAvidum',
    'C.Gran': 'cGranulosum',
    'S.Haem': 'sHaemolyticus',
};

/**
 * Checks if a value is within a range (inclusive).
 * This helper function determines if a bacterial abundance falls within the optimal range.
 */
const isWithinRange = (value: number, minVal: number, maxVal: number): boolean => {
    return value >= minVal && value <= maxVal;
};

/**
 * Calculates the Shannon Diversity Index (H).
 * This measures the diversity of bacterial species in the microbiome.
 * Higher values indicate more diverse bacterial populations.
 * 
 * @param proportions - Array of all 11 bacterial abundances (percentages)
 * @returns The calculated Shannon Index (H), rounded to two decimal places
 */
const calculateShannonIndex = (proportions: number[]): number => {
    let H = 0;
    // Convert percentages to proportions and filter out zeros
    const P_i = proportions
        .map(p => {
            const parsed = parseFloat(p.toString());
            return isNaN(parsed) ? 0 : parsed / 100.0;
        })
        .filter(p => p > 0);

    const sumP = P_i.reduce((sum, p) => sum + p, 0);

    if (sumP === 0 || P_i.length === 0) return 0.00; 

    // Calculate H = -Σ(p_i * ln(p_i))
    for (const p of P_i) {
        // Use normalized proportion if the sum is not 1.0 (due to missing species)
        const normalized_p = p / sumP; 
        // Prevent Math.log(0) which would cause NaN
        if (normalized_p > 0) {
            H += normalized_p * Math.log(normalized_p);
        }
    }
    
    const result = -H;
    return isNaN(result) ? 0.00 : parseFloat(result.toFixed(2));
};

/**
 * Performs linear interpolation to map a value from one range to another.
 * This is used to convert bacterial percentages to age estimates.
 * 
 * @param value - The input value (e.g., marker percentage or H index)
 * @param range1Min - Source range minimum
 * @param range1Max - Source range maximum  
 * @param range2Min - Target range minimum (e.g., age min or DAA min)
 * @param range2Max - Target range maximum (e.g., age max or DAA max)
 * @returns The interpolated value
 */
const interpolateLinear = (value: number, range1Min: number, range1Max: number, range2Min: number, range2Max: number): number => {
    // Handle invalid inputs
    if (isNaN(value) || isNaN(range1Min) || isNaN(range1Max) || isNaN(range2Min) || isNaN(range2Max)) {
        return range2Min;
    }

    // Clamp input value to the source range
    const clampedValue = Math.max(Math.min(value, Math.max(range1Min, range1Max)), Math.min(range1Min, range1Max));

    const range1Span = range1Max - range1Min;
    const range2Span = range2Max - range2Min;

    if (range1Span === 0) return range2Min;

    // Linear scaling formula: TargetMin + TargetSpan * ((Value - SourceMin) / SourceSpan)
    const result = range2Min + range2Span * ((clampedValue - range1Min) / range1Span);
    return isNaN(result) ? range2Min : result;
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
    
    // Normalize bacteria percentages to sum to 100, excluding "other" bacteria
    const normalizedBacteria = normalizeBacteriaPercentages(bacteriaPercentages);
    
    // Convert bacteria names from existing format to new algorithm format
    const abundances: Record<string, number> = {};
    for (const [oldName, percentage] of Object.entries(normalizedBacteria)) {
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
  // Normalize bacteria percentages to sum to 100, excluding "other" bacteria
  const normalizedBacteria = normalizeBacteriaPercentages(bacteriaPercentages);
  
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
    'C.Gran': [0, 1],
    'S.Haem': [0, 1],
    'S.Hom': [0, 1],
  };

  let totalPenalty = 0;
  let diversityPenalty = 0;

  for (const [bacterium, percent] of Object.entries(normalizedBacteria)) {
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

/**
 * Calculates the predicted skin age using a 3-phase algorithm:
 * 1. Weighted Core Age prediction using C. acnes, S. epidermidis, and C. kroppenstedtii
 * 2. Diversity Adjustment (DAA) using the Shannon Index calculated from all 11 inputs
 * 3. Custom Constraint rules based on the Input Age
 * 
 * @param bacteriaPercentages - Object containing bacterial species percentages
 * @param inputAge - The self-reported age of the user (optional, defaults to 40)
 * @returns Detailed prediction results including final age and breakdown
 */
export const estimateAge = (bacteriaPercentages: Record<string, number>, inputAge: number = 40) => {
    const A_input = parseFloat(inputAge.toString());
    
    if (isNaN(A_input) || A_input < 1) {
        return { final_age: 'Error', error_message: 'Invalid Input Age.' };
    }

    // Normalize bacteria percentages to sum to 100, excluding "other" bacteria
    const normalizedBacteria = normalizeBacteriaPercentages(bacteriaPercentages);

    // Convert bacteria names from existing format to age estimation algorithm format
    const allBacteriaPercents: Record<string, number> = {};
    for (const [oldName, percentage] of Object.entries(normalizedBacteria)) {
        const newName = AGE_BACTERIA_MAPPING[oldName as keyof typeof AGE_BACTERIA_MAPPING];
        if (newName && percentage !== undefined && percentage !== null) {
            const parsed = parseFloat(percentage.toString());
            allBacteriaPercents[newName] = isNaN(parsed) ? 0.0 : parsed;
        }
    }

    // Debug: Check if we have any valid data
    const hasValidData = Object.values(allBacteriaPercents).some(val => val > 0);
    if (!hasValidData) {
        return { 
            final_age: 'Error', 
            error_message: 'No valid bacterial data provided. All values are missing or zero.' 
        };
    }

    // --- PHASE 1: Core Age Prediction (Weighted Average) ---
    let totalImpliedAge = 0;
    
    // Determine the effective minimum age for interpolation
    const effectiveAgeMin = Math.min(A_input, AGE_MIN_INTERPOLATION);
    
    CORE_MARKERS.forEach(marker => {
        const percent = parseFloat((allBacteriaPercents[marker.key] || 0).toString()); // Use 0 if marker is missing
        
        // Linear interpolation to find the Implied Age for this marker
        const impliedAge = interpolateLinear(
            percent, 
            marker.min_pct, marker.max_pct, 
            effectiveAgeMin, AGE_MAX_INTERPOLATION 
        );
        
        // Safety check for NaN
        if (!isNaN(impliedAge)) {
            totalImpliedAge += impliedAge;
        }
    });

    const coreWeightedAge = totalImpliedAge / CORE_MARKERS.length;
    
    // Safety check for NaN in core age
    if (isNaN(coreWeightedAge)) {
        return { 
            final_age: 'Error', 
            error_message: 'Core age calculation resulted in NaN. Check bacterial data quality.' 
        };
    }

    // --- PHASE 2: Diversity Adjustment (DAA) ---
    
    // Calculate Shannon Index (H) using all input proportions
    const allProportions = Object.values(allBacteriaPercents);
    const shannonIndex = calculateShannonIndex(allProportions);

    let diversityAdjustment;
    
    if (shannonIndex <= DAA_CONSTANTS.H_MIN) {
        diversityAdjustment = DAA_CONSTANTS.DAA_MIN; // -5
    } else if (shannonIndex >= DAA_CONSTANTS.H_MAX) {
        diversityAdjustment = DAA_CONSTANTS.DAA_MAX; // +5
    } else {
        // Linear Interpolation for DAA based on H index
        diversityAdjustment = interpolateLinear(
            shannonIndex, 
            DAA_CONSTANTS.H_MIN, DAA_CONSTANTS.H_MAX,
            DAA_CONSTANTS.DAA_MIN, DAA_CONSTANTS.DAA_MAX
        );
    }
    
    const diversityAdjustedAge = coreWeightedAge + diversityAdjustment;
    const unconstrainedAgeDetail = parseFloat(diversityAdjustedAge.toFixed(1));
    
    // Safety check for NaN in diversity adjusted age
    if (isNaN(unconstrainedAgeDetail)) {
        return { 
            final_age: 'Error', 
            error_message: 'Diversity adjustment resulted in NaN. Check bacterial data quality.' 
        };
    }

    // --- PHASE 3: Final Constraint (Custom Lower Bound + Fixed Upper Bound) ---
    
    // Calculate the custom Lower Bound
    let lowerBound;
    let lowerBoundRuleText;
    if (A_input >= AGE_MIN_CONSTRAINT_THRESHOLD) {
        // Rule 1: If Input Age >= 16, lowest possible age is 16
        lowerBound = AGE_MIN_CONSTRAINT_THRESHOLD; // 16
        lowerBoundRuleText = `16 years (Absolute Minimum for ages ${AGE_MIN_CONSTRAINT_THRESHOLD}+).`;
    } else {
        // Rule 2: If Input Age < 16, lowest possible age is Input Age - 2
        lowerBound = A_input - 2;
        // Ensure age doesn't go below 1, even for tiny input ages
        if (lowerBound < 1) lowerBound = 1; 
        lowerBoundRuleText = `${lowerBound.toFixed(0)} years (Input Age - 2).`;
    }

    // Upper bound is always Input Age + 10 years
    const upperBound = A_input + MAX_DEVIATION_YEARS; 

    const isConstrained = diversityAdjustedAge > upperBound || diversityAdjustedAge < lowerBound;
    
    let finalSkinAgeRounded;
    let constraintAction;

    if (isConstrained) {
        // Clamp the age using the calculated bounds
        const finalSkinAgeClamped = Math.max(lowerBound, Math.min(upperBound, diversityAdjustedAge));
        finalSkinAgeRounded = parseFloat(finalSkinAgeClamped.toFixed(1));
        
        if (diversityAdjustedAge > upperBound) {
            constraintAction = `Adjusted DOWN. Raw age (${unconstrainedAgeDetail} yrs) exceeded max allowed age (${upperBound} yrs = Input Age + 10).`;
        } else {
            constraintAction = `Adjusted UP. Raw age (${unconstrainedAgeDetail} yrs) was below the minimum allowed age (${finalSkinAgeClamped.toFixed(1)} yrs). Lower bound rule applied: ${lowerBoundRuleText}`;
        }
    } else {
        finalSkinAgeRounded = unconstrainedAgeDetail;
        constraintAction = "No constraint applied. Result is within the custom age range.";
    }

    // Return the detailed breakdown
    return {
        final_age: finalSkinAgeRounded,
        shannon_index: shannonIndex,
        core_age: parseFloat(coreWeightedAge.toFixed(1)),
        daa: parseFloat(diversityAdjustment.toFixed(1)),
        unconstrained_age: unconstrainedAgeDetail,
        constraint_status: constraintAction 
    };
};

export function calculateAntioxidantScore(bacteriaPercentages: BacteriaPercentages): number {
  // Normalize bacteria percentages to sum to 100, excluding "other" bacteria
  const normalizedBacteria = normalizeBacteriaPercentages(bacteriaPercentages);
  
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
    'C.Gran': 0.5,
    'S.Haem': -2.0,
    'S.Hom': 0.5
  };

  // Normalize by scaling bacteria % (0–100) into contribution to antioxidant score
  let score = 0;
  let maxScore = 0;

  for (const [bacterium, weight] of Object.entries(antioxidantWeights)) {
    const percent = normalizedBacteria[bacterium] || 0;
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
  // Normalize bacteria percentages to sum to 100, excluding "other" bacteria
  const normalizedBacteria = normalizeBacteriaPercentages(bacteriaPercentages);
  
  const weights = {
    'S.Epi': 2.0,
    'C.Gran': 1.0,
    'C.Krop': -2.0,
    'S.Aur': -2.0,
    'C.Tub': -1.5,
    'S.Haem': -1.5
  };

  let score = 0;
  let maxScore = 0;

  for (const [bacterium, weight] of Object.entries(weights)) {
    const percent = normalizedBacteria[bacterium] || 0;
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
  // Normalize bacteria percentages to sum to 100, excluding "other" bacteria
  const normalizedBacteria = normalizeBacteriaPercentages(bacteriaPercentages);
  
  const weights = {
    'S.Aur': -2.5,
    'S.Haem': -2.0,
    'C.Krop': -1.5,
    'C.Stri': -1.0,
    'S.Hom': 1.5,
    'S.Epi': 2.0
  };

  let score = 0;
  let maxScore = 0;

  for (const [bacterium, weight] of Object.entries(weights)) {
    const percent = normalizedBacteria[bacterium] || 0;
    // Cap influence of each microbe at 10% abundance for scoring
    const cappedPercent = Math.min(percent, 10) / 10.0;  // Normalize to 0–1
    score += cappedPercent * weight;
    maxScore += Math.abs(weight);  // For normalization
  }

  // Normalize to 0–100 score
  const normalized = (score + maxScore) / (2 * maxScore) * 100;
  return Math.round(normalized);  // Return integer
}
