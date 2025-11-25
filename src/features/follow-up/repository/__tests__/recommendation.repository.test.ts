import { ErrorCodes } from '../../../../lib/utils/error-handling';
import { RecommendationRepository } from '../recommendation.repository';

jest.mock('../../../../lib/supabase/client', () => {
  return {
    supabase: {
      from: jest.fn(),
    },
  };
});

describe('RecommendationRepository', () => {
  const createRepository = () => {
    const { supabase } = require('../../../../lib/supabase/client');
    return {
      repository: new RecommendationRepository(),
      supabase,
    };
  };

  describe('getRecommendationByPatientId', () => {
    it('returns recommendation when found', async () => {
      const { repository, supabase } = createRepository();
      const mockRecommendation = {
        id: 'rec-1',
        patient_id: 'patient-1',
        toothbrush_type: 'soft',
        toothbrush_brand: 'Brand A',
        toothbrush_model: 'Model X',
        entered_by: 'periodontist-1',
        entered_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T10:00:00Z',
      };

      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockMaybeSingle = jest.fn().mockResolvedValue({
        data: mockRecommendation,
        error: null,
      });

      supabase.from.mockReturnValue({
        select: mockSelect,
      });
      mockSelect.mockReturnValue({
        eq: mockEq,
      });
      mockEq.mockReturnValue({
        maybeSingle: mockMaybeSingle,
      });

      const result = await repository.getRecommendationByPatientId('patient-1');

      expect(supabase.from).toHaveBeenCalledWith('oral_hygiene_recommendation');
      expect(mockEq).toHaveBeenCalledWith('patient_id', 'patient-1');
      expect(result).toBeTruthy();
      expect(result?.id).toBe('rec-1');
      expect(result?.patientId).toBe('patient-1');
      expect(result?.toothbrushType).toBe('soft');
    });

    it('returns null when recommendation not found', async () => {
      const { repository, supabase } = createRepository();

      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockMaybeSingle = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      supabase.from.mockReturnValue({
        select: mockSelect,
      });
      mockSelect.mockReturnValue({
        eq: mockEq,
      });
      mockEq.mockReturnValue({
        maybeSingle: mockMaybeSingle,
      });

      const result = await repository.getRecommendationByPatientId('patient-1');

      expect(result).toBeNull();
    });

    it('throws error on network failure', async () => {
      const { repository, supabase } = createRepository();

      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockMaybeSingle = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Network error' },
      });

      supabase.from.mockReturnValue({
        select: mockSelect,
      });
      mockSelect.mockReturnValue({
        eq: mockEq,
      });
      mockEq.mockReturnValue({
        maybeSingle: mockMaybeSingle,
      });

      await expect(
        repository.getRecommendationByPatientId('patient-1'),
      ).rejects.toMatchObject({
        code: ErrorCodes.NETWORK_ERROR,
      });
    });
  });

  describe('createOrUpdateRecommendation', () => {
    it('creates new recommendation when none exists', async () => {
      const { repository, supabase } = createRepository();
      const mockRecommendation = {
        id: 'rec-1',
        patient_id: 'patient-1',
        toothbrush_type: 'soft',
        toothbrush_brand: 'Brand A',
        toothbrush_model: null,
        entered_by: 'periodontist-1',
        entered_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T10:00:00Z',
      };

      // Mock getRecommendationByPatientId to return null
      const mockSelectGet = jest.fn().mockReturnThis();
      const mockEqGet = jest.fn().mockReturnThis();
      const mockMaybeSingleGet = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      // Mock upsert chain
      const mockSelectUpsert = jest.fn().mockReturnThis();
      const mockSingleUpsert = jest.fn().mockResolvedValue({
        data: mockRecommendation,
        error: null,
      });
      const mockUpsert = jest.fn().mockReturnThis();

      supabase.from.mockReturnValue({
        select: mockSelectGet,
        upsert: mockUpsert,
      });
      mockUpsert.mockReturnValue({
        select: mockSelectUpsert,
      });
      mockSelectUpsert.mockReturnValue({
        single: mockSingleUpsert,
      });
      mockSelectGet.mockReturnValue({
        eq: mockEqGet,
      });
      mockEqGet.mockReturnValue({
        maybeSingle: mockMaybeSingleGet,
      });

      const result = await repository.createOrUpdateRecommendation(
        'patient-1',
        'periodontist-1',
        {
          toothbrushType: 'soft',
          toothbrushBrand: 'Brand A',
        },
      );

      expect(mockUpsert).toHaveBeenCalled();
      expect(result).toBeTruthy();
      expect(result.id).toBe('rec-1');
    });

    it('updates existing recommendation', async () => {
      const { repository, supabase } = createRepository();
      const existingRecommendation = {
        id: 'rec-1',
        patient_id: 'patient-1',
        toothbrush_type: 'soft',
        toothbrush_brand: 'Brand A',
        toothbrush_model: null,
        entered_by: 'periodontist-1',
        entered_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T10:00:00Z',
      };

      const updatedRecommendation = {
        ...existingRecommendation,
        toothbrush_model: 'Model X',
        updated_at: '2025-01-16T10:00:00Z',
      };

      // Mock getRecommendationByPatientId to return existing
      const mockSelectGet = jest.fn().mockReturnThis();
      const mockEqGet = jest.fn().mockReturnThis();
      const mockMaybeSingleGet = jest.fn().mockResolvedValue({
        data: existingRecommendation,
        error: null,
      });

      // Mock upsert chain
      const mockSelectUpsert = jest.fn().mockReturnThis();
      const mockSingleUpsert = jest.fn().mockResolvedValue({
        data: updatedRecommendation,
        error: null,
      });
      const mockUpsert = jest.fn().mockReturnThis();

      supabase.from.mockReturnValue({
        select: mockSelectGet,
        upsert: mockUpsert,
      });
      mockUpsert.mockReturnValue({
        select: mockSelectUpsert,
      });
      mockSelectUpsert.mockReturnValue({
        single: mockSingleUpsert,
      });
      mockSelectGet.mockReturnValue({
        eq: mockEqGet,
      });
      mockEqGet.mockReturnValue({
        maybeSingle: mockMaybeSingleGet,
      });

      const result = await repository.createOrUpdateRecommendation(
        'patient-1',
        'periodontist-1',
        {
          toothbrushModel: 'Model X',
        },
      );

      expect(mockUpsert).toHaveBeenCalled();
      expect(result).toBeTruthy();
      expect(result.toothbrushModel).toBe('Model X');
    });
  });
});

