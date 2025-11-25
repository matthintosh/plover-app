import { supabase } from '../../../../lib/supabase/client';
import { ErrorCodes } from '../../../../lib/utils/error-handling';
import { CheckInRepository } from '../check-in.repository';

jest.mock('../../../../lib/supabase/client', () => {
  return {
    supabase: {
      from: jest.fn(),
    },
  };
});

describe('CheckInRepository', () => {
  const mockedSupabase = supabase as unknown as jest.Mocked<typeof supabase>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCheckInByDate', () => {
    it('returns mapped check-in when record is found', async () => {
      const maybeSingleMock = jest.fn().mockResolvedValue({
        data: {
          id: 'checkin-1',
          patient_id: 'patient-1',
          date: '2025-01-15',
          bleeding: 3,
          pain: 2,
          mouth_feeling: 'Good',
          interdental_brush_used: true,
          floss_used: false,
          created_at: '2025-01-15T10:00:00Z',
          updated_at: '2025-01-15T10:00:00Z',
        },
        error: null,
      });

      const eqDateMock = jest.fn(() => ({ maybeSingle: maybeSingleMock }));
      const eqPatientMock = jest.fn(() => ({ eq: eqDateMock }));
      const selectMock = jest.fn(() => ({ eq: eqPatientMock }));

      (mockedSupabase.from as jest.Mock).mockReturnValueOnce({
        select: selectMock,
        eq: eqPatientMock,
        maybeSingle: maybeSingleMock,
      } as any);

      const repository = new CheckInRepository();

      const result = await repository.getCheckInByDate('patient-1', '2025-01-15');

      expect(selectMock).toHaveBeenCalledWith('*');
      expect(eqPatientMock).toHaveBeenCalledWith('patient_id', 'patient-1');
      expect(eqDateMock).toHaveBeenCalledWith('date', '2025-01-15');
      expect(result).toEqual({
        id: 'checkin-1',
        patientId: 'patient-1',
        date: '2025-01-15',
        bleeding: 3,
        pain: 2,
        mouthFeeling: 'Good',
        interdentalBrushUsed: true,
        flossUsed: false,
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-01-15T10:00:00Z',
      });
    });

    it('returns null when no check-in exists for date', async () => {
      const maybeSingleMock = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      const eqDateMock = jest.fn(() => ({ maybeSingle: maybeSingleMock }));
      const eqPatientMock = jest.fn(() => ({ eq: eqDateMock }));
      const selectMock = jest.fn(() => ({ eq: eqPatientMock }));

      (mockedSupabase.from as jest.Mock).mockReturnValueOnce({
        select: selectMock,
        eq: eqPatientMock,
        maybeSingle: maybeSingleMock,
      } as any);

      const repository = new CheckInRepository();

      const result = await repository.getCheckInByDate('patient-1', '2025-01-15');

      expect(result).toBeNull();
    });

    it('throws AppError when supabase returns an error', async () => {
      const maybeSingleMock = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'RLS violation' },
      });

      const eqDateMock = jest.fn(() => ({ maybeSingle: maybeSingleMock }));
      const eqPatientMock = jest.fn(() => ({ eq: eqDateMock }));
      const selectMock = jest.fn(() => ({ eq: eqPatientMock }));

      (mockedSupabase.from as jest.Mock).mockReturnValueOnce({
        select: selectMock,
        eq: eqPatientMock,
        maybeSingle: maybeSingleMock,
      } as any);

      const repository = new CheckInRepository();

      await expect(
        repository.getCheckInByDate('patient-1', '2025-01-15'),
      ).rejects.toMatchObject({
        code: ErrorCodes.NETWORK_ERROR,
      });
    });
  });

  describe('getCheckInsByDateRange', () => {
    it('returns mapped check-ins for date range', async () => {
      const orderMock = jest.fn().mockResolvedValue({
        data: [
          {
            id: 'checkin-1',
            patient_id: 'patient-1',
            date: '2025-01-15',
            bleeding: 3,
            pain: 2,
            mouth_feeling: 'Good',
            interdental_brush_used: true,
            floss_used: false,
            created_at: '2025-01-15T10:00:00Z',
            updated_at: '2025-01-15T10:00:00Z',
          },
          {
            id: 'checkin-2',
            patient_id: 'patient-1',
            date: '2025-01-16',
            bleeding: 2,
            pain: 1,
            mouth_feeling: null,
            interdental_brush_used: false,
            floss_used: true,
            created_at: '2025-01-16T10:00:00Z',
            updated_at: '2025-01-16T10:00:00Z',
          },
        ],
        error: null,
      });

      const gteMock = jest.fn(() => ({ lte: jest.fn(() => ({ order: orderMock })) }));
      const lteMock = jest.fn(() => ({ order: orderMock }));
      const eqMock = jest.fn(() => ({ gte: gteMock, lte: lteMock }));
      const selectMock = jest.fn(() => ({ eq: eqMock }));

      (mockedSupabase.from as jest.Mock).mockReturnValueOnce({
        select: selectMock,
        eq: eqMock,
        gte: gteMock,
        lte: lteMock,
        order: orderMock,
      } as any);

      const repository = new CheckInRepository();

      const result = await repository.getCheckInsByDateRange(
        'patient-1',
        '2025-01-15',
        '2025-01-16',
      );

      expect(selectMock).toHaveBeenCalledWith('*');
      expect(eqMock).toHaveBeenCalledWith('patient_id', 'patient-1');
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 'checkin-1',
        patientId: 'patient-1',
        date: '2025-01-15',
        bleeding: 3,
        pain: 2,
        mouthFeeling: 'Good',
        interdentalBrushUsed: true,
        flossUsed: false,
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-01-15T10:00:00Z',
      });
    });

    it('returns empty array when no check-ins exist in range', async () => {
      const orderMock = jest.fn().mockResolvedValue({
        data: [],
        error: null,
      });

      const gteMock = jest.fn(() => ({ lte: jest.fn(() => ({ order: orderMock })) }));
      const eqMock = jest.fn(() => ({ gte: gteMock }));
      const selectMock = jest.fn(() => ({ eq: eqMock }));

      (mockedSupabase.from as jest.Mock).mockReturnValueOnce({
        select: selectMock,
        eq: eqMock,
        gte: gteMock,
        order: orderMock,
      } as any);

      const repository = new CheckInRepository();

      const result = await repository.getCheckInsByDateRange(
        'patient-1',
        '2025-01-15',
        '2025-01-16',
      );

      expect(result).toEqual([]);
    });
  });

  describe('createOrUpdateCheckIn', () => {
    it('creates new check-in when none exists', async () => {
      const singleMock = jest.fn().mockResolvedValue({
        data: {
          id: 'checkin-1',
          patient_id: 'patient-1',
          date: '2025-01-15',
          bleeding: 3,
          pain: 2,
          mouth_feeling: 'Good',
          interdental_brush_used: true,
          floss_used: false,
          created_at: '2025-01-15T10:00:00Z',
          updated_at: '2025-01-15T10:00:00Z',
        },
        error: null,
      });

      const selectMock = jest.fn(() => ({ single: singleMock }));
      const upsertMock = jest.fn(() => ({ select: selectMock }));

      (mockedSupabase.from as jest.Mock).mockReturnValueOnce({
        upsert: upsertMock,
        select: selectMock,
      } as any);

      const repository = new CheckInRepository();

      const result = await repository.createOrUpdateCheckIn('patient-1', {
        date: '2025-01-15',
        bleeding: 3,
        pain: 2,
        mouthFeeling: 'Good',
        interdentalBrushUsed: true,
        flossUsed: false,
      });

      expect(upsertMock).toHaveBeenCalled();
      expect(result).toEqual({
        id: 'checkin-1',
        patientId: 'patient-1',
        date: '2025-01-15',
        bleeding: 3,
        pain: 2,
        mouthFeeling: 'Good',
        interdentalBrushUsed: true,
        flossUsed: false,
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-01-15T10:00:00Z',
      });
    });
  });
});

