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
 * @param bacteriaData - Object containing bacterial species percentages (can include null/undefined values)
 * @returns Normalized bacteria percentages that sum to 100
 */
export const normalizeBacteriaPercentages = (bacteriaData: Record<string, number | null | undefined>): Record<string, number> => {
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
      // Handle null, undefined, or invalid values by treating them as 0
      const percentage = (value === null || value === undefined) ? 0 : parseFloat(value.toString()) || 0;
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
    // Handle NaN values by setting them to 0 for bacteria calculations
    const safePercent = isNaN(percent) ? 0 : percent;
    
    // Calculate diversity penalty for any bacteria over 80%
    if (safePercent > 80) {
      diversityPenalty += safePercent - 80;
    }

    // Calculate optimal range penalties
    const optRange = optimalRanges[bacterium as keyof typeof optimalRanges] || [0, 0];
    const [minOpt, maxOpt] = optRange;

    if (safePercent < minOpt) {
      totalPenalty += (minOpt - safePercent) / 2;
    } else if (safePercent > maxOpt) {
      totalPenalty += (safePercent - maxOpt) / 2;
    }
  }

  // Calculate final score
  const microbiomeScore = Math.max(0, 100 - totalPenalty - diversityPenalty);
  
  return Math.round(microbiomeScore);
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

// --- Antioxidant Capacity Score Configuration Constants ---

// The optimal ranges are fixed to the "Young" configuration (age < 40) for ALL ages.
// The 'min' for smaller bacteria is set to 0.0 to reflect that concentrations "less than X%" 
// (i.e., from 0% up to the maximum) are considered optimal.
const FIXED_OPTIMAL_RANGES = {
    // Proportional Scores (Optimal/Cap fixed to Young values)
    sEpidermidis: { optimal: 5, cap_over: 30 }, // Optimal 5%, Cap 30%
    cAcnes: { optimal: 74, cap_under: 40 }, // Optimal 74%, Cap 40% (Penalized below optimal)
    sHominis: { optimal: 1, cap_over: 10 }, // Optimal 1%, Cap 10%

    // Full/Zero Score (Optimal range is 0 to Max)
    sCapitis: { min: 0.0, max: 5 }, // Optimal 0% to 5%
    cStriatum: { min: 0.0, max: 5 }, // Optimal 0% to 5%
    cAvidum: { min: 0.0, max: 5 }, // Optimal 0% to 5%
    cGranulosum: { min: 0.0, max: 1 }, // Optimal 0% to 1%
    cTuberculostearicum: { min: 0.0, max: 0.5 }, // Optimal 0% to 0.5%

    // Penalty-Only (Penalty applied if outside 0 to Max range)
    cKroppenstedtii: { min: 0.0, max: 5 }, // Optimal 0% to 5%
    sHaemolyticus: { min: 0.0, max: 1 }, // Optimal 0% to 1%
    sAureus: { min: 0.0, max: 1 } // Optimal 0% to 1%
};

// Defines the points and penalties for each bacteria type
const SCORING_MATRIX = {
    sEpidermidis: { points: 35, type: 'proportional' },
    cAcnes: { points: 35, type: 'proportional' },
    sHominis: { points: 15, type: 'proportional' },
    sCapitis: { points: 3, type: 'full_zero' },
    cStriatum: { points: 3, type: 'full_zero' },
    cAvidum: { points: 3, type: 'full_zero' },
    cGranulosum: { points: 3, type: 'full_zero' },
    cTuberculostearicum: { points: 3, type: 'full_zero' },
    cKroppenstedtii: { penalty: 10, type: 'penalty' },
    sAureus: { penalty: 20, type: 'penalty' },
    sHaemolyticus: { penalty: 15, type: 'penalty' }
} as const;

/**
 * Helper function to check if a value is within a specified range (inclusive).
 * This function determines if a bacterial abundance falls within the optimal range.
 * 
 * @param value - The percentage value to check
 * @param min - The minimum of the range
 * @param max - The maximum of the range
 * @returns True if value is in range, false otherwise
 */
const isInRange = (value: number, min: number, max: number): boolean => value >= min && value <= max;

/**
 * Calculates the Antioxidant Capacity Score based on bacterial percentages and age.
 * This function implements a complex scoring algorithm that considers:
 * - Proportional scoring for major species (S. epidermidis, C. acnes, S. hominis)
 * - Full/zero scoring for secondary species (3 points if in optimal range, 0 otherwise)
 * - Flat penalty deductions for harmful species (C. kroppenstedtii, S. aureus, S. haemolyticus)
 * 
 * NOTE: The age input only affects the 'age_group' output for context; it does NOT
 * affect the actual scoring calculation, which is fixed to the 'Young' ranges.
 * 
 * @param bacteriaPercentages - Object containing bacterial species percentages
 * @param age - The subject's age (used for contextual output only)
 * @returns An object containing the final score and detailed breakdown
 */
export function calculateAntioxidantScore(bacteriaPercentages: BacteriaPercentages, age: number): {
    final_score: number;
    score_before_clamp: number;
    age_group: string;
    breakdown: Record<string, number>;
    total_penalty: number;
} {
    // Normalize bacteria percentages to sum to 100, excluding "other" bacteria
    const normalizedBacteria = normalizeBacteriaPercentages(bacteriaPercentages);
    
    // Convert bacteria names from existing format to new algorithm format
    const percentages: Record<string, number> = {};
    for (const [oldName, percentage] of Object.entries(normalizedBacteria)) {
        const newName = AGE_BACTERIA_MAPPING[oldName as keyof typeof AGE_BACTERIA_MAPPING];
        if (newName && percentage !== undefined && percentage !== null) {
            percentages[newName] = parseFloat(percentage.toString()) || 0.0;
        }
    }

    let finalScore = 0;
    const isOld = age >= 40;
    const optimalConfig = FIXED_OPTIMAL_RANGES;
    const breakdown: Record<string, number> = {};

    // --- 1. Proportional Scoring (S. epi, C. acnes, S. hominis) ---

    // S. epidermidis (Max 35 points)
    const epiPct = parseFloat(percentages.sEpidermidis?.toString()) || 0;
    const epiOptimal = optimalConfig.sEpidermidis.optimal; // 5
    const epiCap = optimalConfig.sEpidermidis.cap_over; // 30
    let epiScore;

    if (epiPct <= epiOptimal) {
        // Under optimal (0-5%): Score is proportional
        epiScore = SCORING_MATRIX.sEpidermidis.points * (epiPct / epiOptimal);
    } else if (epiPct <= epiCap) {
        // Between optimal and cap (5-30%): Score is penalized relative to the distance from optimal, scaled by cap
        const penaltyRatio = Math.abs(epiPct - epiOptimal) / epiCap;
        epiScore = SCORING_MATRIX.sEpidermidis.points * (1 - penaltyRatio);
    } else {
        // Over hard cap: 0 points
        epiScore = 0;
    }
    epiScore = Math.max(0, epiScore);
    breakdown.sEpidermidis = parseFloat(epiScore.toFixed(2));
    finalScore += epiScore;

    // C. acnes (Max 35 points)
    const acnesPct = parseFloat(percentages.cAcnes?.toString()) || 0;
    const acnesOptimal = optimalConfig.cAcnes.optimal; // 74
    const acnesCap = optimalConfig.cAcnes.cap_under; // 40
    let acnesScore;

    if (acnesPct >= acnesOptimal) {
        // Over optimal (74-100%): Penalized by distance from optimal, scaled by optimal
        const penaltyRatio = Math.abs(acnesPct - acnesOptimal) / acnesOptimal;
        acnesScore = SCORING_MATRIX.cAcnes.points * (1 - penaltyRatio);
    } else if (acnesPct >= acnesCap) {
        // Between optimal and cap (40-74%): Penalized by distance from optimal, scaled to cap
        const penaltyRatio = Math.abs(acnesPct - acnesOptimal) / acnesCap;
        acnesScore = SCORING_MATRIX.cAcnes.points * (1 - penaltyRatio);
    } else {
        // Below hard cap: 0 points
        acnesScore = 0;
    }
    acnesScore = Math.max(0, acnesScore);
    breakdown.cAcnes = parseFloat(acnesScore.toFixed(2));
    finalScore += acnesScore;

    // S. hominis (Max 15 points)
    const hominisPct = parseFloat(percentages.sHominis?.toString()) || 0;
    const hominisOptimal = optimalConfig.sHominis.optimal; // 1
    const hominisCap = optimalConfig.sHominis.cap_over; // 10
    let hominisScore;
    
    if (hominisPct <= hominisOptimal) {
        // Under optimal (0-1%): Score is proportional to ratio
        const penaltyRatio = Math.abs(hominisPct - hominisOptimal) / hominisOptimal;
        hominisScore = SCORING_MATRIX.sHominis.points * (1 - penaltyRatio);
    } else if (hominisPct <= hominisCap) {
        // Between optimal and cap (1-10%): Penalized by distance from optimal, scaled to cap
        const penaltyRatio = Math.abs(hominisPct - hominisOptimal) / hominisCap;
        hominisScore = SCORING_MATRIX.sHominis.points * (1 - penaltyRatio);
    } else {
        // Over hard cap: 0 points
        hominisScore = 0;
    }
    hominisScore = Math.max(0, hominisScore);
    breakdown.sHominis = parseFloat(hominisScore.toFixed(2));
    finalScore += hominisScore;

    // --- 2. Full/Zero Scoring (5 species, Max 15 Pts) ---
    const fullZeroScoringKeys = ['sCapitis', 'cStriatum', 'cAvidum', 'cGranulosum', 'cTuberculostearicum'];
    
    fullZeroScoringKeys.forEach(key => {
        const pct = parseFloat(percentages[key]?.toString()) || 0;
        const range = optimalConfig[key as keyof typeof optimalConfig] as { min: number; max: number };
        const scoringEntry = SCORING_MATRIX[key as keyof typeof SCORING_MATRIX] as { points: number; type: string };
        const points = scoringEntry.points;
        let score = 0;

        if (isInRange(pct, range.min, range.max)) {
            score = points; // Full points awarded
        } else {
            score = 0; // Zero points awarded (over max)
        }
        breakdown[key] = parseFloat(score.toFixed(2));
        finalScore += score;
    });

    // --- 3. Flat Penalty Deductions (3 species, Max -45 Pts) ---
    const penaltyKeys = ['cKroppenstedtii', 'sAureus', 'sHaemolyticus'];
    let totalPenalty = 0;

    penaltyKeys.forEach(key => {
        const pct = parseFloat(percentages[key]?.toString()) || 0;
        const scoringEntry = SCORING_MATRIX[key as keyof typeof SCORING_MATRIX] as { penalty: number; type: string };
        const penaltyValue = scoringEntry.penalty;
        let penalty = 0;
        const range = optimalConfig[key as keyof typeof optimalConfig] as { min: number; max: number };
        
        // Penalty applies if the percentage is OUT of the optimal range (i.e., above the max)
        if (!isInRange(pct, range.min, range.max)) {
            penalty = penaltyValue;
        }
        
        breakdown[key + '_penalty'] = penalty;
        totalPenalty += penalty;
    });
    
    finalScore -= totalPenalty;
    
    // --- 4. Final Clamp and Return ---
    const finalScoreClamped = Math.min(100, Math.max(0, finalScore));

    return {
        final_score: parseFloat(finalScoreClamped.toFixed(1)),
        score_before_clamp: parseFloat(finalScore.toFixed(2)),
        age_group: isOld ? 'Old (≥ 40)' : 'Young (< 40)',
        breakdown: breakdown,
        total_penalty: totalPenalty
    };
}

/**
 * Microbiome Skin Type Scorer
 * ----------------------------
 * Calculates a skin type score based on 11 bacterial abundances and age.
 * Score: 0 = Most Dry, 100 = Most Oily.
 * Logic includes age-dependent optimal targets and contribution caps to ensure
 * no single bacterium can push the score to 0 or 100 alone.
 */

// --- Scoring Constants and Targets ---

const OPTIMAL_MICROBIOME = {
    // Age < 40 targets
    young: { 
        'C.Acne': 74, 'S.Epi': 5, 'C.Krop': 2, 'S.Hom': 1, 'S.Cap': 3, 'S.Haem': 0.5, 'C.Stri': 3, 'C.Avi': 3, 'C.Gran': 0.5, 'C.Tub': 0.3, 'S.Aur': 0.5
    },
    // Age >= 40 targets
    old: { 
        'C.Acne': 40, 'S.Epi': 12, 'C.Krop': 13, 'S.Hom': 1, 'S.Cap': 3, 'S.Haem': 0.5, 'C.Stri': 3, 'C.Avi': 3, 'C.Gran': 0.5, 'C.Tub': 0.3, 'S.Aur': 0.5
    }
};

// Weights determine how strongly a 1% deviation impacts the score.
const SCORING_WEIGHTS = {
    'C.Acne': 2.0,            // C. acnes: Primary oily driver
    'S.Aur': 5.0,             // S. aureus: Critical dry driver
    'S.Epi_low': 1.5,         // S. epidermidis decrease (oily push)
    'S.Epi_high_pull': 0.3,   // S. epidermidis excess (pull towards 50)
    'C.Krop': 1.5,            // C. kroppenstedtii: Significant dry/aging indicator
    Oily_Minor: 1.5,          // C. avidum, C. tuberculostearicum, C. granulosum
    Dry_Minor: 1.0,           // S. hominis, S. capitis, S. haemolyticus, C. striatum
};

// Maximum Contribution Caps (Absolute Score Change from 50)
// This ensures no single factor dominates the 0-100 range.
const CAPS = {
    MAJOR_DRIVER: 30,  // C. acnes, S. aureus (max swing to 20 or 80)
    MODERATE_DRIVER: 15, // C. kroppenstedtii, S. epidermidis (low)
    MINOR_GROUP_SUM: 15 // Sum of all minor oily/dry drivers
}

/**
 * Determines the optimal target profile based on age.
 * @param age - The user's age.
 * @returns The optimal microbiome target percentages.
 */
function getOptimalTargets(age: number) {
    return age >= 40 ? OPTIMAL_MICROBIOME.old : OPTIMAL_MICROBIOME.young;
}

/**
 * Calculates the Sebum Index based on bacterial composition and age.
 * This score measures the skin's oil production potential using a sophisticated
 * algorithm that considers age-dependent optimal targets and contribution caps.
 * 
 * Higher scores indicate higher sebum production potential (oily skin), while 
 * lower scores indicate drier skin with reduced oil production (matte skin).
 * 
 * @param bacteriaPercentages - Object containing bacterial species percentages
 * @param age - The user's age (used to determine optimal targets)
 * @returns A score from 0-100 representing sebum production potential
 */
export function calculateSebumIndex(bacteriaPercentages: BacteriaPercentages, age: number = 30): number {
    // Normalize bacteria percentages to sum to 100, excluding "other" bacteria
    const normalizedBacteria = normalizeBacteriaPercentages(bacteriaPercentages);
    
    const targets = getOptimalTargets(age);
    
    // Start the cumulative adjustment from 50 (Balanced)
    let score_adjustment = 0; 
    let se_excess = 0; // S. epidermidis excess for final pull

    // --- 1. C. acnes (Primary Driver: Deviation = Oily/Dry) ---
    // Handle NaN values by setting them to 0 for bacteria calculations
    const Ca_value = isNaN(normalizedBacteria['C.Acne']) ? 0 : normalizedBacteria['C.Acne'];
    const Ca_diff = Ca_value - targets['C.Acne'];
    let ca_contrib = Ca_diff * SCORING_WEIGHTS['C.Acne'];
    // Cap contribution: max 30 point swing (+30 or -30)
    ca_contrib = Math.max(-CAPS.MAJOR_DRIVER, Math.min(CAPS.MAJOR_DRIVER, ca_contrib));
    score_adjustment += ca_contrib;
    
    // --- 2. S. aureus (Critical Dryness Indicator: Higher = More Dry) ---
    let sa_contrib = 0;
    const Sa_value = isNaN(normalizedBacteria['S.Aur']) ? 0 : normalizedBacteria['S.Aur'];
    if (Sa_value > targets['S.Aur']) {
        const Sa_diff = Sa_value - targets['S.Aur'];
        sa_contrib = -Sa_diff * SCORING_WEIGHTS['S.Aur'];
    }
    // Cap contribution: max 30 point swing (negative only)
    sa_contrib = Math.max(-CAPS.MAJOR_DRIVER, sa_contrib); 
    score_adjustment += sa_contrib;

    // --- 3. S. epidermidis (Complex Rule) ---
    const Se_value = isNaN(normalizedBacteria['S.Epi']) ? 0 : normalizedBacteria['S.Epi'];
    const Se_diff = Se_value - targets['S.Epi'];
    if (Se_diff < 0) {
        // Decrease from optimal means skin is more oily (positive adjustment)
        let se_contrib = Math.abs(Se_diff) * SCORING_WEIGHTS['S.Epi_low'];
        // Cap positive contribution: max 15 point swing
        se_contrib = Math.min(CAPS.MODERATE_DRIVER, se_contrib); 
        score_adjustment += se_contrib;
    } else if (Se_diff > 0) {
        // S. epidermidis is above optimal, save for the final pull towards 50
        se_excess = Se_diff;
    }

    // --- 4. C. kroppenstedtii (Dry/Aging Driver: Higher = More Dry) ---
    let ck_contrib = 0;
    const Ck_value = isNaN(normalizedBacteria['C.Krop']) ? 0 : normalizedBacteria['C.Krop'];
    if (Ck_value > targets['C.Krop']) {
        const Ck_diff = Ck_value - targets['C.Krop'];
        ck_contrib = -Ck_diff * SCORING_WEIGHTS['C.Krop'];
    }
    // Cap negative contribution: max 15 point swing
    ck_contrib = Math.max(-CAPS.MODERATE_DRIVER, ck_contrib);
    score_adjustment += ck_contrib;

    // --- 5. Minor Oily Drivers (C. avidum, C. tuberculostearicum, C. granulosum) ---
    let minor_oily_sum = 0;
    const oilyDrivers: (keyof BacteriaPercentages)[] = ['C.Avi', 'C.Tub', 'C.Gran'];
    oilyDrivers.forEach(key => {
        // Handle NaN values by setting them to 0 for bacteria calculations
        const bacteriaValue = isNaN(normalizedBacteria[key]) ? 0 : normalizedBacteria[key];
        if (bacteriaValue > targets[key]) {
            const diff = bacteriaValue - targets[key];
            minor_oily_sum += diff * SCORING_WEIGHTS.Oily_Minor;
        }
    });
    // Cap minor oily group sum: max 15 point swing (positive only)
    minor_oily_sum = Math.min(CAPS.MINOR_GROUP_SUM, minor_oily_sum); 
    score_adjustment += minor_oily_sum;

    // --- 6. Minor Dry Drivers (S. hominis, S. capitis, S. haemolyticus, C. striatum) ---
    let minor_dry_sum = 0;
    const dryDrivers: (keyof BacteriaPercentages)[] = ['S.Hom', 'S.Cap', 'S.Haem', 'C.Stri'];
    dryDrivers.forEach(key => {
        // Handle NaN values by setting them to 0 for bacteria calculations
        const bacteriaValue = isNaN(normalizedBacteria[key]) ? 0 : normalizedBacteria[key];
        if (bacteriaValue > targets[key]) {
            const diff = bacteriaValue - targets[key];
            minor_dry_sum -= diff * SCORING_WEIGHTS.Dry_Minor; // Subtracts points
        }
    });
    // Cap minor dry group sum: max 15 point swing (negative only)
    minor_dry_sum = Math.max(-CAPS.MINOR_GROUP_SUM, minor_dry_sum);
    score_adjustment += minor_dry_sum;
    
    // Apply all primary adjustments to the starting score
    let score = 50.0 + score_adjustment;
    
    // --- 7. Final S. epidermidis Neutralizing Pull ---
    // If S.Epi is high, pull the score back toward 50 (neutral).
    if (se_excess > 0) {
        const pull_magnitude = se_excess * SCORING_WEIGHTS['S.Epi_high_pull'];
        
        if (score > 50) {
            // Oily score, pull down towards 50
            score -= pull_magnitude;
        } else if (score < 50) {
            // Dry score, pull up towards 50
            score += pull_magnitude;
        }
    }
    
    // Final Clamp to 0-100
    score = Math.max(0, Math.min(100, score));

    return Math.round(score);
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
    // Handle NaN values by setting them to 0 for bacteria calculations
    const rawPercent = normalizedBacteria[bacterium] || 0;
    const percent = isNaN(rawPercent) ? 0 : rawPercent;
    // Cap influence of each microbe at 10% abundance for scoring
    const cappedPercent = Math.min(percent, 10) / 10.0;  // Normalize to 0–1
    score += cappedPercent * weight;
    maxScore += Math.abs(weight);  // For normalization
  }

  // Normalize to 0–100 score
  const normalized = (score + maxScore) / (2 * maxScore) * 100;
  return Math.round(normalized);  // Return integer
}

// --- Sensitivity Score Configuration Constants ---

/**
 * Helper class for bacteria with defined min/max range boundaries.
 * This represents optimal ranges for bacterial concentrations.
 */
interface Range {
    min: number;
    max: number;
}

/**
 * Enumeration for Age Group (maps to range data)
 * This determines which set of optimal ranges to use for calculations.
 */
export type AgeGroup = 'YOUNG' | 'OLD';

/**
 * Map to hold all optimal ranges, indexed by AgeGroup.
 * Contains the optimal bacterial concentrations for different age groups.
 * All percentages are expected as double values (e.g., 1.6 for 1.6%).
 */
const SENSITIVITY_RANGES: Record<AgeGroup, Record<string, number | Range>> = {
    // --- YOUNG (Under 40) Ranges ---
    YOUNG: {
        'S.Epi': 5.0,   // S. epidermidis (Optimal Center)
        'C.Acne': 74.0,        // C. acnes (Optimal Center)
        'C.Krop': { min: 2.0, max: 2.0 }, // C. kroppenstedtii
        'S.Cap': { min: 0.0, max: 5.0 },        // S. capitis
        'C.Stri': { min: 0.0, max: 5.0 },       // C. striatum
        'C.Tub': { min: 0.0, max: 0.5 }, // C. tuberculostearicum
        'C.Avi': { min: 0.0, max: 5.0 },         // C. avidum
        'C.Gran': { min: 0.0, max: 1.0 },     // C. granulosum
        'S.Haem': { min: 0.0, max: 1.0 },  // S. haemolyticus
        'S.Hom': 1.0,       // S. hominis (Optimal Max)
        'S.Aur': { min: 0.0, max: 1.0 },         // S. aureus
    },
    
    // --- OLD (40 and Over) Ranges ---
    OLD: {
        'S.Epi': 12.0,
        'C.Acne': 40.0,
        'C.Krop': { min: 10.0, max: 16.0 },
        'S.Cap': { min: 0.0, max: 5.0 },
        'C.Stri': { min: 0.0, max: 5.0 },
        'C.Tub': { min: 0.0, max: 0.5 },
        'C.Avi': { min: 0.0, max: 5.0 },
        'C.Gran': { min: 0.0, max: 1.0 },
        'S.Haem': { min: 0.0, max: 1.0 },
        'S.Hom': 1.0,
        'S.Aur': { min: 0.0, max: 1.0 },
    },
};

/**
 * Helper function to convert age to AgeGroup enum.
 * This function determines whether a person is considered 'YOUNG' (under 40) or 'OLD' (40 and older).
 * 
 * @param age - The person's age
 * @returns The corresponding AgeGroup ('YOUNG' or 'OLD')
 */
export function getAgeGroup(age: number): AgeGroup {
    return age < 40 ? 'YOUNG' : 'OLD';
}

/**
 * Calculates the Sensitivity Score based on the provided bacterial data and age group.
 * This function implements the specific scoring logic for skin sensitivity based on
 * 11 bacterial concentration percentages and the user's age group.
 * The final score is clamped between 0 (least sensitive) and 100 (most sensitive).
 * All percentages are expected as double values (e.g., 1.6 for 1.6%).
 *
 * @param bacteriaPercentages - Object containing bacterial species percentages
 * @param ageGroup - The age group ('YOUNG' for under 40, 'OLD' for 40 and older)
 * @returns The final sensitivity score as an integer (0 to 100)
 */
export function calculateSensitivityScore(bacteriaPercentages: BacteriaPercentages, ageGroup: AgeGroup): { final_score: number };
/**
 * Calculates the Sensitivity Score based on the provided bacterial data and age.
 * This is a convenience overload that automatically determines the age group.
 *
 * @param bacteriaPercentages - Object containing bacterial species percentages
 * @param age - The person's age (used to determine age group)
 * @returns An object containing the final sensitivity score as an integer (0 to 100)
 */
export function calculateSensitivityScore(bacteriaPercentages: BacteriaPercentages, age: number): { final_score: number };
export function calculateSensitivityScore(bacteriaPercentages: BacteriaPercentages, ageOrGroup: number | AgeGroup): { final_score: number } {
    // Determine the age group - if a number is passed, convert it to AgeGroup
  const ageGroup: AgeGroup = typeof ageOrGroup === 'number' ? getAgeGroup(ageOrGroup) : ageOrGroup;
    
    // Start with baseline score of 50
    let score = 50.0;
    
    // Get the current ranges for the specified age group
    const currentRanges = SENSITIVITY_RANGES[ageGroup];
    
    // Normalize bacteria percentages to sum to 100, excluding "other" bacteria
    const normalizedBacteria = normalizeBacteriaPercentages(bacteriaPercentages);

    // --- 1. Extract Data ---
    const saur = normalizedBacteria['S.Aur'] || 0.0;
    const shae = normalizedBacteria['S.Haem'] || 0.0;
    const ckro = normalizedBacteria['C.Krop'] || 0.0;
    const cstr = normalizedBacteria['C.Stri'] || 0.0;
    const scap = normalizedBacteria['S.Cap'] || 0.0;
    const cavi = normalizedBacteria['C.Avi'] || 0.0;
    const cgra = normalizedBacteria['C.Gran'] || 0.0;
    const ctub = normalizedBacteria['C.Tub'] || 0.0;
    const sepi = normalizedBacteria['S.Epi'] || 0.0;
    const shom = normalizedBacteria['S.Hom'] || 0.0;
    const cacn = normalizedBacteria['C.Acne'] || 0.0;
    

    // --- 2. Calculate Penalties (Additions to Score) ---

    // S. aureus penalties
    const saurRange = currentRanges['S.Aur'] as Range;
    if (saur > saurRange.max) { // > 1.0%
        score += 25;
        if (saur > 5) {
            score += 10; // Cumulative: +10 if > 5.0%
        }
    }
    // General Extreme Penalty (Excluding C. acnes, S. hominis, S. epidermidis, C. kroppenstedtii)
    if (saur > saurRange.max + 10) {
        score += 10;
    }

    // S. haemolyticus penalties
    const shaeRange = currentRanges['S.Haem'] as Range;
    if (shae > shaeRange.max) { // > 1.0%
        score += 25;
    }
    if (shae > shaeRange.max + 10) {
        score += 10;
    }

    // C. kroppenstedtii penalties (Uses specific tiered penalties ONLY)
    const ckroRange = currentRanges['C.Krop'] as Range;
    if (ckro > ckroRange.max) {
        score += 15;
        if (ckro > ckroRange.max + 5) {
            score += 10; // Cumulative: +10 if > Max + 5
        }
    }

    // C. striatum penalties
    const cstrRange = currentRanges['C.Stri'] as Range;
    if (cstr > cstrRange.max) { // > 5.0%
        score += 10;
    }
    if (cstr > cstrRange.max + 10) {
        score += 10;
    }

    // S. capitis penalties
    const scapRange = currentRanges['S.Cap'] as Range;
    if (scap > scapRange.max) { // > 5.0%
        score += 10;
    }
    if (scap > scapRange.max + 10) {
        score += 10;
    }

    // C. avidum penalties
    const caviRange = currentRanges['C.Avi'] as Range;
    if (cavi > caviRange.max) { // > 5.0%
        score += 5;
    }
    if (cavi > caviRange.max + 10) {
        score += 10;
    }

    // C. granulosum penalties
    const cgraRange = currentRanges['C.Gran'] as Range;
    if (cgra > cgraRange.max) { // > 1.0%
        score += 5;
    }
    if (cgra > cgraRange.max + 10) {
        score += 10;
    }

    // C. tuberculostearicum penalties
    const ctubRange = currentRanges['C.Tub'] as Range;
    if (ctub > ctubRange.max) { // > 0.5%
        score += 5;
    }
    if (ctub > ctubRange.max + 10) {
        score += 10;
    }

    // --- 3. Calculate Deductions (Subtractions from Score) ---

    // A. S. epidermidis Deduction (SEpi)
    let deductionSEpi = 0;
    const optSEpi = currentRanges['S.Epi'] as number;

    if (ageGroup === 'YOUNG') {
        if (sepi >= 4 && sepi <= 6) deductionSEpi = -35;
        else if (sepi > 6 || (sepi >= 2 && sepi <= 4)) deductionSEpi = -20;
        else if (sepi > 1 && sepi < 2) deductionSEpi = -5;
    } else { // OLD
        if (sepi >= 10 && sepi <= 14) deductionSEpi = -35;
        else if (sepi >= 5 && sepi < 10) deductionSEpi = -20;
        else if (sepi >= 1 && sepi < 5) deductionSEpi = -5;
    }
    score += deductionSEpi;

    // B. S. hominis Deduction (SHom)
    let deductionSHom = 0;
    const optSHom = currentRanges['S.Hom'] as number;
    const weightSHom = 5.0;

    if (shom <= 10.0) { // No deduction if > 10%
        if (shom >= optSHom) {
            deductionSHom = -weightSHom; // Full deduction (-5)
        } else if (shom < optSHom) {
            // Proportional deduction
            deductionSHom = -(shom / optSHom) * weightSHom;
        }
    }
    score += deductionSHom;

    // C. C. acnes Deduction/Penalty (CAcn)
    let deductionCAcn = 0;
    const optCAcn = currentRanges['C.Acne'] as number;
    const diff = cacn - optCAcn;

    if (ageGroup === 'YOUNG') {
        // Young Optimal: 74%. Full deduction range: 70% to 78% (diff: -4 to 4)
        if (diff >= -4 && diff <= 4) { 
            deductionCAcn = 30;
        // Penalty threshold: > 82% (diff > 8)
        } else if (diff > 8) { 
            deductionCAcn = 15; // Penalty
        }
    } else { // OLD
        // Old Optimal: 40%. Full deduction range: 35% to 60% (diff: -5 to 20)
        if (diff >= -5 && diff <= 20) { 
            deductionCAcn = 30;
        // Penalty threshold: > 75% (diff > 35)
        } else if (diff > 35) { 
            deductionCAcn = 15; // Penalty
        }
    }
    score += deductionCAcn;

    // --- 4. Final Score Clamping (0 to 100) ---
    const finalScore = Math.round(Math.max(0, Math.min(100, score)));
    return { final_score: finalScore };
}

// --- Example Usage (for testing) ---
/**
 * Example usage of the sensitivity score calculation.
 * This demonstrates how to use the function with sample data.
 * 
 * Uncomment the code below to test the implementation:
 */
/*
// Example Data Set (from the Java implementation)
const sampleData: BacteriaPercentages = {
    'C.Acne': 66.0,
    'S.Epi': 1.6,
    'S.Hom': 0.8,
    'S.Cap': 0.0,
    'S.Haem': 0.0,
    'C.Krop': 11.4,
    'C.Stri': 0.2,
    'C.Avi': 0.0,
    'C.Gran': 16.6,
    'C.Tub': 0.1,
    'S.Aur': 0.0,
};

// Calculate for a Young user (Under 40)
const youngScoreResult = calculateSensitivityScore(sampleData, 25); // Using age
console.log("Sensitivity Score (Young): " + youngScoreResult.final_score + " / 100");

// Calculate for an Old user (40 and Over)
const oldScoreResult = calculateSensitivityScore(sampleData, 50); // Using age
console.log("Sensitivity Score (Old): " + oldScoreResult.final_score + " / 100");

// Alternative: Using AgeGroup directly
const youngScoreDirect = calculateSensitivityScore(sampleData, 'YOUNG');
const oldScoreDirect = calculateSensitivityScore(sampleData, 'OLD');
console.log("Sensitivity Score (Young, direct): " + youngScoreDirect.final_score + " / 100");
console.log("Sensitivity Score (Old, direct): " + oldScoreDirect.final_score + " / 100");
*/
