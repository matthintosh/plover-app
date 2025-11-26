import { supabase } from '@/lib/supabase/client';
import { AppError, ErrorCodes } from '@/lib/utils/error-handling';
import type { OdontogramRepositoryPort } from './odontogram.repository.interface';
import type { Odontogram, OdontogramSpace } from '../service/types';

export class OdontogramRepository implements OdontogramRepositoryPort {
  async getOdontogramByRecommendationId(
    recommendationId: string,
  ): Promise<Odontogram | null> {
    const { data, error } = await supabase
      .from('odontogram')
      .select('*')
      .eq('oral_hygiene_recommendation_id', recommendationId)
      .maybeSingle();

    if (error) {
      throw new AppError(ErrorCodes.NETWORK_ERROR, error.message, error);
    }

    if (!data) {
      return null;
    }

    return this.mapRowToOdontogram(data);
  }

  async createOrUpdateOdontogram(
    recommendationId: string,
    spaces: Array<{
      spaceId: string;
      toolType: 'interdental_brush' | 'floss';
      brushSize?: string;
    }>,
  ): Promise<Odontogram> {
    // Check if odontogram exists
    const existing = await this.getOdontogramByRecommendationId(recommendationId);

    const odontogramData = {
      oral_hygiene_recommendation_id: recommendationId,
      spaces: spaces as any, // JSONB field
    };

    const { data: upsertedData, error } = await supabase
      .from('odontogram')
      .upsert(odontogramData, {
        onConflict: 'oral_hygiene_recommendation_id',
      })
      .select()
      .single();

    if (error) {
      throw new AppError(ErrorCodes.NETWORK_ERROR, error.message, error);
    }

    return this.mapRowToOdontogram(upsertedData);
  }

  async deleteOdontogram(recommendationId: string): Promise<void> {
    const { error } = await supabase
      .from('odontogram')
      .delete()
      .eq('oral_hygiene_recommendation_id', recommendationId);

    if (error) {
      throw new AppError(ErrorCodes.NETWORK_ERROR, error.message, error);
    }
  }

  private mapRowToOdontogram(row: {
    id: string;
    oral_hygiene_recommendation_id: string;
    spaces: any; // JSONB
    created_at: string;
    updated_at: string;
  }): Odontogram {
    // Ensure spaces array is properly typed
    const spacesArray = Array.isArray(row.spaces) ? row.spaces : [];
    const mappedSpaces: OdontogramSpace[] = spacesArray.map((space: any) => ({
      spaceId: space.spaceId || space.space_id,
      toolType: space.toolType || space.tool_type,
      brushSize: space.brushSize || space.brush_size,
    }));

    return {
      id: row.id,
      spaces: mappedSpaces,
    };
  }
}





