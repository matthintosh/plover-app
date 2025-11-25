import type { OralHygieneRecommendation } from '../service/types';

export interface RecommendationRepositoryPort {
  getRecommendationByPatientId(
    patientId: string,
  ): Promise<OralHygieneRecommendation | null>;
  createOrUpdateRecommendation(
    patientId: string,
    periodontistId: string,
    data: {
      toothbrushType?: string;
      toothbrushBrand?: string;
      toothbrushModel?: string;
      odontogram?: {
        spaces: Array<{
          spaceId: string;
          toolType: 'interdental_brush' | 'floss';
          brushSize?: string;
        }>;
      };
    },
  ): Promise<OralHygieneRecommendation>;
}



