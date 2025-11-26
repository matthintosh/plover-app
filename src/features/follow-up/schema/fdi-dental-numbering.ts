/**
 * European Dental Numbering System (FDI World Dental Federation Notation)
 * 
 * Quadrant 1 (Upper Right): 11-18
 * Quadrant 2 (Upper Left): 21-28
 * Quadrant 3 (Lower Left): 31-38
 * Quadrant 4 (Lower Right): 41-48
 */

export type ToothNumber = 
  // Upper Right (Quadrant 1)
  | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18
  // Upper Left (Quadrant 2)
  | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28
  // Lower Left (Quadrant 3)
  | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38
  // Lower Right (Quadrant 4)
  | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48;

export interface Tooth {
  number: ToothNumber;
  name: string;
  quadrant: 1 | 2 | 3 | 4;
  position: 'central' | 'lateral' | 'canine' | 'first_premolar' | 'second_premolar' | 'first_molar' | 'second_molar' | 'third_molar';
}

export interface InterdentalSpace {
  spaceId: string; // Format: "11-12", "12-13", etc.
  tooth1: ToothNumber;
  tooth2: ToothNumber;
  quadrant: 1 | 2 | 3 | 4;
}

/**
 * All teeth in FDI notation
 */
export const TEETH: Record<ToothNumber, Tooth> = {
  // Upper Right (Quadrant 1)
  11: { number: 11, name: 'Central Incisor', quadrant: 1, position: 'central' },
  12: { number: 12, name: 'Lateral Incisor', quadrant: 1, position: 'lateral' },
  13: { number: 13, name: 'Canine', quadrant: 1, position: 'canine' },
  14: { number: 14, name: 'First Premolar', quadrant: 1, position: 'first_premolar' },
  15: { number: 15, name: 'Second Premolar', quadrant: 1, position: 'second_premolar' },
  16: { number: 16, name: 'First Molar', quadrant: 1, position: 'first_molar' },
  17: { number: 17, name: 'Second Molar', quadrant: 1, position: 'second_molar' },
  18: { number: 18, name: 'Third Molar', quadrant: 1, position: 'third_molar' },
  
  // Upper Left (Quadrant 2)
  21: { number: 21, name: 'Central Incisor', quadrant: 2, position: 'central' },
  22: { number: 22, name: 'Lateral Incisor', quadrant: 2, position: 'lateral' },
  23: { number: 23, name: 'Canine', quadrant: 2, position: 'canine' },
  24: { number: 24, name: 'First Premolar', quadrant: 2, position: 'first_premolar' },
  25: { number: 25, name: 'Second Premolar', quadrant: 2, position: 'second_premolar' },
  26: { number: 26, name: 'First Molar', quadrant: 2, position: 'first_molar' },
  27: { number: 27, name: 'Second Molar', quadrant: 2, position: 'second_molar' },
  28: { number: 28, name: 'Third Molar', quadrant: 2, position: 'third_molar' },
  
  // Lower Left (Quadrant 3)
  31: { number: 31, name: 'Central Incisor', quadrant: 3, position: 'central' },
  32: { number: 32, name: 'Lateral Incisor', quadrant: 3, position: 'lateral' },
  33: { number: 33, name: 'Canine', quadrant: 3, position: 'canine' },
  34: { number: 34, name: 'First Premolar', quadrant: 3, position: 'first_premolar' },
  35: { number: 35, name: 'Second Premolar', quadrant: 3, position: 'second_premolar' },
  36: { number: 36, name: 'First Molar', quadrant: 3, position: 'first_molar' },
  37: { number: 37, name: 'Second Molar', quadrant: 3, position: 'second_molar' },
  38: { number: 38, name: 'Third Molar', quadrant: 3, position: 'third_molar' },
  
  // Lower Right (Quadrant 4)
  41: { number: 41, name: 'Central Incisor', quadrant: 4, position: 'central' },
  42: { number: 42, name: 'Lateral Incisor', quadrant: 4, position: 'lateral' },
  43: { number: 43, name: 'Canine', quadrant: 4, position: 'canine' },
  44: { number: 44, name: 'First Premolar', quadrant: 4, position: 'first_premolar' },
  45: { number: 45, name: 'Second Premolar', quadrant: 4, position: 'second_premolar' },
  46: { number: 46, name: 'First Molar', quadrant: 4, position: 'first_molar' },
  47: { number: 47, name: 'Second Molar', quadrant: 4, position: 'second_molar' },
  48: { number: 48, name: 'Third Molar', quadrant: 4, position: 'third_molar' },
};

/**
 * Generate all interdental spaces in FDI notation
 * Format: "11-12", "12-13", etc.
 */
export function generateInterdentalSpaces(): InterdentalSpace[] {
  const spaces: InterdentalSpace[] = [];
  
  // Quadrant 1 (Upper Right): 11-18
  const quadrant1Teeth: ToothNumber[] = [11, 12, 13, 14, 15, 16, 17, 18];
  for (let i = 0; i < quadrant1Teeth.length - 1; i++) {
    spaces.push({
      spaceId: `${quadrant1Teeth[i]}-${quadrant1Teeth[i + 1]}`,
      tooth1: quadrant1Teeth[i],
      tooth2: quadrant1Teeth[i + 1],
      quadrant: 1,
    });
  }
  
  // Quadrant 2 (Upper Left): 21-28
  const quadrant2Teeth: ToothNumber[] = [21, 22, 23, 24, 25, 26, 27, 28];
  for (let i = 0; i < quadrant2Teeth.length - 1; i++) {
    spaces.push({
      spaceId: `${quadrant2Teeth[i]}-${quadrant2Teeth[i + 1]}`,
      tooth1: quadrant2Teeth[i],
      tooth2: quadrant2Teeth[i + 1],
      quadrant: 2,
    });
  }
  
  // Quadrant 3 (Lower Left): 31-38
  const quadrant3Teeth: ToothNumber[] = [31, 32, 33, 34, 35, 36, 37, 38];
  for (let i = 0; i < quadrant3Teeth.length - 1; i++) {
    spaces.push({
      spaceId: `${quadrant3Teeth[i]}-${quadrant3Teeth[i + 1]}`,
      tooth1: quadrant3Teeth[i],
      tooth2: quadrant3Teeth[i + 1],
      quadrant: 3,
    });
  }
  
  // Quadrant 4 (Lower Right): 41-48
  const quadrant4Teeth: ToothNumber[] = [41, 42, 43, 44, 45, 46, 47, 48];
  for (let i = 0; i < quadrant4Teeth.length - 1; i++) {
    spaces.push({
      spaceId: `${quadrant4Teeth[i]}-${quadrant4Teeth[i + 1]}`,
      tooth1: quadrant4Teeth[i],
      tooth2: quadrant4Teeth[i + 1],
      quadrant: 4,
    });
  }
  
  return spaces;
}

/**
 * Get all interdental spaces (cached)
 */
export const INTERDENTAL_SPACES = generateInterdentalSpaces();

/**
 * Get spaces for a specific quadrant
 */
export function getSpacesByQuadrant(quadrant: 1 | 2 | 3 | 4): InterdentalSpace[] {
  return INTERDENTAL_SPACES.filter((space) => space.quadrant === quadrant);
}

/**
 * Get tooth by number
 */
export function getTooth(number: ToothNumber): Tooth {
  return TEETH[number];
}

/**
 * Validate if a space ID is valid FDI notation
 */
export function isValidSpaceId(spaceId: string): boolean {
  return INTERDENTAL_SPACES.some((space) => space.spaceId === spaceId);
}

