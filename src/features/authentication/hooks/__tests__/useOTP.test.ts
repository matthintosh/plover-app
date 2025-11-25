import { renderHook, waitFor } from '@testing-library/react-native';
import { useOTP } from '../useOTP';
import { AuthService } from '../../service/auth.service';

jest.mock('../../service/auth.service');
jest.mock('../useAuth', () => ({
  useAuth: () => ({
    setUser: jest.fn(),
    setPatient: jest.fn(),
  }),
}));

describe('useOTP', () => {
  const mockAuthService = {
    requestPatientOTP: jest.fn(),
    verifyPatientOTP: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (AuthService as jest.MockedClass<typeof AuthService>).mockImplementation(
      () => mockAuthService as any,
    );
  });

  it('requests OTP code successfully', async () => {
    mockAuthService.requestPatientOTP.mockResolvedValue({
      success: true,
      message: 'OTP code sent',
    });

    const { result } = renderHook(() => useOTP());

    await result.current.requestOTP('patient@example.com');

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockAuthService.requestPatientOTP).toHaveBeenCalledWith({
      email: 'patient@example.com',
    });
    expect(result.current.error).toBeNull();
  });

  it('handles OTP request errors', async () => {
    mockAuthService.requestPatientOTP.mockRejectedValue(
      new Error('Failed to send OTP'),
    );

    const { result } = renderHook(() => useOTP());

    await result.current.requestOTP('patient@example.com');

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeTruthy();
    });
  });

  it('verifies OTP code successfully', async () => {
    mockAuthService.verifyPatientOTP.mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      userId: 'user-1',
      user: { id: 'user-1', email: 'patient@example.com' } as any,
    });

    const { result } = renderHook(() => useOTP());

    const verifyResult = await result.current.verifyOTP({
      email: 'patient@example.com',
      token: '123456',
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(verifyResult).toBeTruthy();
    expect(mockAuthService.verifyPatientOTP).toHaveBeenCalledWith({
      email: 'patient@example.com',
      token: '123456',
    });
    expect(result.current.error).toBeNull();
  });

  it('handles OTP verification errors', async () => {
    mockAuthService.verifyPatientOTP.mockRejectedValue(
      new Error('Invalid OTP code'),
    );

    const { result } = renderHook(() => useOTP());

    const verifyResult = await result.current.verifyOTP({
      email: 'patient@example.com',
      token: 'wrong-code',
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeTruthy();
    });

    expect(verifyResult).toBeNull();
  });

  it('resets error state', () => {
    const { result } = renderHook(() => useOTP());

    result.current.resetError();

    expect(result.current.error).toBeNull();
  });
});
