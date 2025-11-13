import { supabase } from '../../../../lib/supabase/client';
import { PeriodontistRepository } from '../periodontist.repository';

jest.mock('../../../../lib/supabase/client', () => {
  return {
    supabase: {
      rpc: jest.fn(),
      from: jest.fn(),
    },
  };
});

describe('PeriodontistRepository', () => {
  const mockedSupabase = supabase as unknown as jest.Mocked<typeof supabase>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates periodontist profiles with expected payload', async () => {
    const rpcMock = mockedSupabase.rpc as jest.Mock;
    rpcMock.mockResolvedValue({
      data: {
        id: 'periodontist-1',
        email: 'dr@example.com',
        full_name: 'Dr. Tooth',
        professional_credentials: 'DDS',
        account_status: 'active',
        created_at: 'now',
        updated_at: 'now',
      },
      error: null,
    });

    const repository = new PeriodontistRepository();

    const result = await repository.createPeriodontist({
      id: 'periodontist-1',
      email: 'dr@example.com',
      fullName: 'Dr. Tooth',
      professionalCredentials: 'DDS',
    });

    expect(rpcMock).toHaveBeenCalledWith('create_periodontist_profile', {
      p_id: 'periodontist-1',
      p_email: 'dr@example.com',
      p_full_name: 'Dr. Tooth',
      p_professional_credentials: 'DDS',
    });
    expect(result.id).toBe('periodontist-1');
  });

  it('finds periodontist by email', async () => {
    const maybeSingleMock = jest.fn().mockResolvedValue({
      data: { id: 'periodontist-1', email: 'dr@example.com', full_name: 'Dr. Tooth', professional_credentials: 'DDS', account_status: 'active', created_at: 'now', updated_at: 'now' },
      error: null,
    });

    const eqMock = jest.fn(() => ({ maybeSingle: maybeSingleMock }));
    const selectMock = jest.fn(() => ({ maybeSingle: maybeSingleMock, eq: eqMock }));

    (mockedSupabase.from as jest.Mock).mockReturnValueOnce({
      select: selectMock,
      eq: eqMock,
      maybeSingle: maybeSingleMock,
    } as any);

    const repository = new PeriodontistRepository();

    const result = await repository.findByEmail('dr@example.com');

    expect(selectMock).toHaveBeenCalledWith('*');
    expect(result?.email).toBe('dr@example.com');
  });

  it('updates periodontist profile fields', async () => {
    const singleMock = jest.fn().mockResolvedValue({
      data: { id: 'periodontist-1', email: 'dr@example.com', full_name: 'Dr. New Name', professional_credentials: 'DDS', account_status: 'active', created_at: 'now', updated_at: 'later' },
      error: null,
    });

    const updateMock = jest.fn(() => ({
      eq: jest.fn(() => ({ select: jest.fn(() => ({ single: singleMock })) })),
    }));

    (mockedSupabase.from as jest.Mock).mockReturnValueOnce({
      update: updateMock,
      select: jest.fn(() => ({ single: singleMock })),
    } as any);

    const repository = new PeriodontistRepository();

    const result = await repository.updatePeriodontist('periodontist-1', { fullName: 'Dr. New Name' });

    expect(updateMock).toHaveBeenCalledWith(expect.objectContaining({ full_name: 'Dr. New Name' }));
    expect(result.fullName).toBe('Dr. New Name');
  });
});
