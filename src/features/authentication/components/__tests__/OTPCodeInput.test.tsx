import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { OTPCodeInput } from '../OTPCodeInput';

describe('OTPCodeInput', () => {
  const defaultProps = {
    value: '',
    onChangeText: jest.fn(),
    error: null,
    loading: false,
  };

  it('renders a single input field for OTP code', () => {
    const { getByTestId } = render(<OTPCodeInput {...defaultProps} />);

    const input = getByTestId('otp-input');
    expect(input).toBeTruthy();
  });

  it('calls onChangeText when code is entered', () => {
    const onChangeText = jest.fn();
    const { getByTestId } = render(
      <OTPCodeInput {...defaultProps} onChangeText={onChangeText} />,
    );

    const input = getByTestId('otp-input');
    fireEvent.changeText(input, '1');

    expect(onChangeText).toHaveBeenCalledWith('1');
  });

  it('only accepts numeric input', () => {
    const onChangeText = jest.fn();
    const { getByTestId } = render(
      <OTPCodeInput {...defaultProps} onChangeText={onChangeText} />,
    );

    const input = getByTestId('otp-input');
    fireEvent.changeText(input, 'abc123');

    // Should filter out non-numeric characters
    expect(onChangeText).toHaveBeenCalledWith('123');
  });

  it('limits input to 8 digits', () => {
    const onChangeText = jest.fn();
    const { getByTestId } = render(
      <OTPCodeInput {...defaultProps} onChangeText={onChangeText} />,
    );

    const input = getByTestId('otp-input');
    fireEvent.changeText(input, '123456789012345');

    // Should limit to 8 digits
    expect(onChangeText).toHaveBeenCalledWith('12345678');
  });

  it('shows error message when provided', () => {
    const { getByText } = render(
      <OTPCodeInput {...defaultProps} error="Invalid OTP code" />,
    );

    expect(getByText(/invalid otp code/i)).toBeTruthy();
  });

  it('disables input when loading', () => {
    const { getByTestId } = render(
      <OTPCodeInput {...defaultProps} loading={true} />,
    );

    const input = getByTestId('otp-input');
    expect(input.props.editable).toBe(false);
  });

  it('has accessibility labels', () => {
    const { getByLabelText } = render(<OTPCodeInput {...defaultProps} />);

    expect(getByLabelText(/otp code input/i)).toBeTruthy();
  });

  it('displays entered code value', () => {
    const { getByTestId } = render(
      <OTPCodeInput {...defaultProps} value="12345678" />,
    );

    const input = getByTestId('otp-input');
    expect(input.props.value).toBe('12345678');
  });
});
