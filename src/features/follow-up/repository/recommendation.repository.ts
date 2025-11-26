import { supabase } from '@/lib/supabase/client';
import { AppError, ErrorCodes } from '@/lib/utils/error-handling';
import type { RecommendationRepositoryPort } from './recommendation.repository.interface';
import type { OralHygieneRecommendation } from '../service/types';
import { OdontogramRepository } from './odontogram.repository';

export class RecommendationRepository implements RecommendationRepositoryPort {
  private odontogramRepository = new OdontogramRepository();

  async getRecommendationByPatientId(
    patientId: string,
  ): Promise<OralHygieneRecommendation | null> {
    const { data, error } = await supabase
      .from('oral_hygiene_recommendation')
      .select('*')
      .eq('patient_id', patientId)
      .maybeSingle();

    if (error) {
      throw new AppError(ErrorCodes.NETWORK_ERROR, error.message, error);
    }

    if (!data) {
      return null;
    }

    // Fetch associated odontogram if it exists
    const odontogram = await this.odontogramRepository.getOdontogramByRecommendationId(
      data.id,
    );

    return this.mapRowToRecommendation(data, odontogram);
  }

  async createOrUpdateRecommendation(
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
  ): Promise<OralHygieneRecommendation> {
    // Check if recommendation exists
    const existing = await this.getRecommendationByPatientId(patientId);

    const recommendationData: {
      patient_id: string;
      entered_by: string;
      toothbrush_type?: string | null;
      toothbrush_brand?: string | null;
      toothbrush_model?: string | null;
    } = {
      patient_id: patientId,
      entered_by: periodontistId,
      toothbrush_type: data.toothbrushType || null,
      toothbrush_brand: data.toothbrushBrand || null,
      toothbrush_model: data.toothbrushModel || null,
    };

    // If updating, preserve existing values for fields not provided
    if (existing) {
      recommendationData.toothbrush_type =
        data.toothbrushType !== undefined ? data.toothbrushType : existing.toothbrushType || null;
      recommendationData.toothbrush_brand =
        data.toothbrushBrand !== undefined
          ? data.toothbrushBrand
          : existing.toothbrushBrand || null;
      recommendationData.toothbrush_model =
        data.toothbrushModel !== undefined
          ? data.toothbrushModel
          : existing.toothbrushModel || null;
    }

    const { data: upsertedData, error } = await supabase
      .from('oral_hygiene_recommendation')
      .upsert(recommendationData, {
        onConflict: 'patient_id',
      })
      .select()
      .single();

    if (error) {
      throw new AppError(ErrorCodes.NETWORK_ERROR, error.message, error);
    }

    // Handle odontogram if provided
    let odontogram = null;
    if (data.odontogram && data.odontogram.spaces.length > 0) {
      odontogram = await this.odontogramRepository.createOrUpdateOdontogram(
        upsertedData.id,
        data.odontogram.spaces,
      );
    } else if (existing?.odontogram && data.odontogram === null) {
      // If odontogram is explicitly set to null, delete it
      await this.odontogramRepository.deleteOdontogram(upsertedData.id);
    } else if (existing?.odontogram) {
      // Preserve existing odontogram if not provided
      odontogram = existing.odontogram;
    }

    return this.mapRowToRecommendation(upsertedData, odontogram);
  }

  private mapRowToRecommendation(
    row: {
      id: string;
      patient_id: string;
      toothbrush_type: string | null;
      toothbrush_brand: string | null;
      toothbrush_model: string | null;
      entered_by: string;
      entered_at: string;
      updated_at: string;
    },
    odontogram: any,
  ): OralHygieneRecommendation {
    return {
      id: row.id,
      patientId: row.patient_id,
      toothbrushType: row.toothbrush_type || undefined,
      toothbrushBrand: row.toothbrush_brand || undefined,
      toothbrushModel: row.toothbrush_model || undefined,
      odontogram: odontogram || undefined,
      enteredBy: row.entered_by,
      enteredAt: row.entered_at,
      updatedAt: row.updated_at,
    };
  }
}





