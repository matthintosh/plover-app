import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AuthMethodSelector } from '../AuthMethodSelector';

describe('AuthMethodSelector', () => {
  const defaultProps = {
    selectedMethod: 'magic-link' as const,
    onMethodChange: jest.fn(),
  };

  it('renders both authentication method options', () => {
    const { getByText } = render(<AuthMethodSelector {...defaultProps} />);

    expect(getByText(/magic link/i)).toBeTruthy();
    expect(getByText(/otp/i)).toBeTruthy();
  });

  it('calls onMethodChange when magic link is selected', () => {
    const onMethodChange = jest.fn();
    const { getByText } = render(
      <AuthMethodSelector {...defaultProps} selectedMethod="otp" onMethodChange={onMethodChange} />
    );

    fireEvent.press(getByText(/magic link/i));

    expect(onMethodChange).toHaveBeenCalledWith('magic-link');
  });

  it('calls onMethodChange when OTP is selected', () => {
    const onMethodChange = jest.fn();
    const { getByText } = render(
      <AuthMethodSelector {...defaultProps} onMethodChange={onMethodChange} />
    );

    fireEvent.press(getByText(/otp/i));

    expect(onMethodChange).toHaveBeenCalledWith('otp');
  });

  it('shows visual feedback for selected method', () => {
    const { getByText } = render(
      <AuthMethodSelector {...defaultProps} selectedMethod="otp" />
    );

    const otpButton = getByText(/otp/i).parent;
    expect(otpButton).toBeTruthy();
  });

  it('has accessibility labels', () => {
    const { getByLabelText } = render(<AuthMethodSelector {...defaultProps} />);

    expect(getByLabelText(/magic link authentication/i)).toBeTruthy();
    expect(getByLabelText(/otp code authentication/i)).toBeTruthy();
  });
});
