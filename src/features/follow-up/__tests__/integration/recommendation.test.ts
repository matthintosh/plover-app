import { FollowUpService } from '../../service/follow-up.service';
import { RecommendationRepository } from '../../repository/recommendation.repository';
import { OdontogramRepository } from '../../repository/odontogram.repository';

jest.mock('../../../../lib/supabase/client', () => {
  return {
    supabase: {
      from: jest.fn(),
    },
  };
});

describe('FollowUpService - Recommendation Integration', () => {
  const createService = () => {
    const recommendationRepository = new RecommendationRepository();
    const odontogramRepository = new OdontogramRepository();
    return {
      service: new FollowUpService(
        undefined as any,
        undefined as any,
        recommendationRepository,
      ),
      recommendationRepository,
      odontogramRepository,
    };
  };

  it('creates recommendation with odontogram through service', async () => {
    const { service, recommendationRepository } = createService();

    const mockRecommendation = {
      id: 'rec-1',
      patientId: 'patient-1',
      toothbrushType: 'soft',
      toothbrushBrand: 'Brand A',
      toothbrushModel: 'Model X',
      odontogram: {
        id: 'odo-1',
        spaces: [
          { spaceId: '1-2', toolType: 'interdental_brush', brushSize: '0.5mm' },
          { spaceId: '2-3', toolType: 'floss' },
        ],
      },
      enteredBy: 'periodontist-1',
      enteredAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-01-15T10:00:00Z',
    };

    jest
      .spyOn(recommendationRepository, 'getRecommendationByPatientId')
      .mockResolvedValue(null);
    jest
      .spyOn(recommendationRepository, 'createOrUpdateRecommendation')
      .mockResolvedValue(mockRecommendation);

    const result = await service.createOrUpdateRecommendation(
      'patient-1',
      'periodontist-1',
      {
        toothbrushType: 'soft',
        toothbrushBrand: 'Brand A',
        toothbrushModel: 'Model X',
        odontogram: {
          spaces: [
            { spaceId: '1-2', toolType: 'interdental_brush', brushSize: '0.5mm' },
            { spaceId: '2-3', toolType: 'floss' },
          ],
        },
      },
    );

    expect(result).toBeTruthy();
    expect(result.id).toBe('rec-1');
    expect(result.odontogram).toBeTruthy();
    expect(result.odontogram?.spaces).toHaveLength(2);
  });

  it('retrieves recommendation with odontogram through service', async () => {
    const { service, recommendationRepository } = createService();

    const mockRecommendation = {
      id: 'rec-1',
      patientId: 'patient-1',
      toothbrushType: 'soft',
      toothbrushBrand: 'Brand A',
      odontogram: {
        id: 'odo-1',
        spaces: [{ spaceId: '1-2', toolType: 'interdental_brush', brushSize: '0.5mm' }],
      },
      enteredBy: 'periodontist-1',
      enteredAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-01-15T10:00:00Z',
    };

    jest
      .spyOn(recommendationRepository, 'getRecommendationByPatientId')
      .mockResolvedValue(mockRecommendation);

    const result = await service.getRecommendationByPatientId('patient-1');

    expect(result).toBeTruthy();
    expect(result?.id).toBe('rec-1');
    expect(result?.odontogram).toBeTruthy();
  });

  it('returns null when recommendation not found', async () => {
    const { service, recommendationRepository } = createService();

    jest
      .spyOn(recommendationRepository, 'getRecommendationByPatientId')
      .mockResolvedValue(null);

    const result = await service.getRecommendationByPatientId('patient-1');

    expect(result).toBeNull();
  });
});



