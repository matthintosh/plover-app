import type { Odontogram } from '../service/types';

export interface OdontogramRepositoryPort {
  getOdontogramByRecommendationId(
    recommendationId: string,
  ): Promise<Odontogram | null>;
  createOrUpdateOdontogram(
    recommendationId: string,
    spaces: Array<{
      spaceId: string;
      toolType: 'interdental_brush' | 'floss';
      brushSize?: string;
    }>,
  ): Promise<Odontogram>;
  deleteOdontogram(recommendationId: string): Promise<void>;
}





