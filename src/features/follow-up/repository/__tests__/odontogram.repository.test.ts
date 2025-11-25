import { ErrorCodes } from '../../../../lib/utils/error-handling';
import { OdontogramRepository } from '../odontogram.repository';

jest.mock('../../../../lib/supabase/client', () => {
  return {
    supabase: {
      from: jest.fn(),
    },
  };
});

describe('OdontogramRepository', () => {
  const createRepository = () => {
    const { supabase } = require('../../../../lib/supabase/client');
    return {
      repository: new OdontogramRepository(),
      supabase,
    };
  };

  describe('getOdontogramByRecommendationId', () => {
    it('returns odontogram when found', async () => {
      const { repository, supabase } = createRepository();
      const mockOdontogram = {
        id: 'odo-1',
        oral_hygiene_recommendation_id: 'rec-1',
        spaces: [
          { spaceId: '1-2', toolType: 'interdental_brush', brushSize: '0.5mm' },
          { spaceId: '2-3', toolType: 'floss' },
        ],
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T10:00:00Z',
      };

      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockMaybeSingle = jest.fn().mockResolvedValue({
        data: mockOdontogram,
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

      const result = await repository.getOdontogramByRecommendationId('rec-1');

      expect(supabase.from).toHaveBeenCalledWith('odontogram');
      expect(mockEq).toHaveBeenCalledWith('oral_hygiene_recommendation_id', 'rec-1');
      expect(result).toBeTruthy();
      expect(result?.id).toBe('odo-1');
      expect(result?.spaces).toHaveLength(2);
    });

    it('returns null when odontogram not found', async () => {
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

      const result = await repository.getOdontogramByRecommendationId('rec-1');

      expect(result).toBeNull();
    });
  });

  describe('createOrUpdateOdontogram', () => {
    it('creates new odontogram when none exists', async () => {
      const { repository, supabase } = createRepository();
      const spaces = [
        { spaceId: '1-2', toolType: 'interdental_brush' as const, brushSize: '0.5mm' },
        { spaceId: '2-3', toolType: 'floss' as const },
      ];

      const mockOdontogram = {
        id: 'odo-1',
        oral_hygiene_recommendation_id: 'rec-1',
        spaces,
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T10:00:00Z',
      };

      // Mock getOdontogramByRecommendationId to return null
      const mockSelectGet = jest.fn().mockReturnThis();
      const mockEqGet = jest.fn().mockReturnThis();
      const mockMaybeSingleGet = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      // Mock upsert chain
      const mockSelectUpsert = jest.fn().mockReturnThis();
      const mockSingleUpsert = jest.fn().mockResolvedValue({
        data: mockOdontogram,
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

      const result = await repository.createOrUpdateOdontogram('rec-1', spaces);

      expect(mockUpsert).toHaveBeenCalled();
      expect(result).toBeTruthy();
      expect(result.spaces).toHaveLength(2);
    });

    it('updates existing odontogram', async () => {
      const { repository, supabase } = createRepository();
      const existingOdontogram = {
        id: 'odo-1',
        oral_hygiene_recommendation_id: 'rec-1',
        spaces: [{ spaceId: '1-2', toolType: 'interdental_brush', brushSize: '0.5mm' }],
        created_at: '2025-01-15T10:00:00Z',
        updated_at: '2025-01-15T10:00:00Z',
      };

      const updatedSpaces = [
        { spaceId: '1-2', toolType: 'interdental_brush' as const, brushSize: '0.7mm' },
        { spaceId: '2-3', toolType: 'floss' as const },
      ];

      const updatedOdontogram = {
        ...existingOdontogram,
        spaces: updatedSpaces,
        updated_at: '2025-01-16T10:00:00Z',
      };

      // Mock getOdontogramByRecommendationId to return existing
      const mockSelectGet = jest.fn().mockReturnThis();
      const mockEqGet = jest.fn().mockReturnThis();
      const mockMaybeSingleGet = jest.fn().mockResolvedValue({
        data: existingOdontogram,
        error: null,
      });

      // Mock upsert chain
      const mockSelectUpsert = jest.fn().mockReturnThis();
      const mockSingleUpsert = jest.fn().mockResolvedValue({
        data: updatedOdontogram,
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

      const result = await repository.createOrUpdateOdontogram('rec-1', updatedSpaces);

      expect(mockUpsert).toHaveBeenCalled();
      expect(result).toBeTruthy();
      expect(result.spaces).toHaveLength(2);
    });
  });

  describe('deleteOdontogram', () => {
    it('deletes odontogram successfully', async () => {
      const { repository, supabase } = createRepository();

      const mockDelete = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      supabase.from.mockReturnValue({
        delete: mockDelete,
      });
      mockDelete.mockReturnValue({
        eq: mockEq,
      });

      await repository.deleteOdontogram('rec-1');

      expect(supabase.from).toHaveBeenCalledWith('odontogram');
      expect(mockEq).toHaveBeenCalledWith('oral_hygiene_recommendation_id', 'rec-1');
    });
  });
});

