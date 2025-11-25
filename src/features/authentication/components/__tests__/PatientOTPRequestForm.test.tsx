import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { PatientOTPRequestForm } from '../PatientOTPRequestForm';

describe('PatientOTPRequestForm', () => {
  const defaultProps = {
    onSubmit: jest.fn(),
    loading: false,
    error: null,
  };

  it('renders email input and submit button', () => {
    const { getByPlaceholderText, getByRole } = render(
      <PatientOTPRequestForm {...defaultProps} />,
    );

    expect(getByPlaceholderText(/enter your email/i)).toBeTruthy();
    expect(getByRole('button', { name: /send otp code/i })).toBeTruthy();
  });

  it('submits form with entered email', async () => {
    const onSubmit = jest.fn();
    const { getByPlaceholderText, getByRole } = render(
      <PatientOTPRequestForm {...defaultProps} onSubmit={onSubmit} />,
    );

    fireEvent.changeText(getByPlaceholderText(/enter your email/i), 'patient@example.com');
    fireEvent.press(getByRole('button', { name: /send otp code/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith('patient@example.com');
    });
  });

  it('shows validation error for empty email', async () => {
    const { getByRole, findByText } = render(
      <PatientOTPRequestForm {...defaultProps} />,
    );

    fireEvent.press(getByRole('button', { name: /send otp code/i }));

    expect(await findByText(/email is required/i)).toBeTruthy();
  });

  it('shows validation error for invalid email format', async () => {
    const { getByPlaceholderText, getByRole, findByText } = render(
      <PatientOTPRequestForm {...defaultProps} />,
    );

    fireEvent.changeText(getByPlaceholderText(/enter your email/i), 'invalid-email');
    fireEvent.press(getByRole('button', { name: /send otp code/i }));

    expect(await findByText(/valid email address/i)).toBeTruthy();
  });

  it('shows error message when provided', () => {
    const { getByText } = render(
      <PatientOTPRequestForm {...defaultProps} error="Failed to send OTP" />,
    );

    expect(getByText(/failed to send otp/i)).toBeTruthy();
  });

  it('shows success message when OTP is sent', () => {
    const { getByText } = render(
      <PatientOTPRequestForm {...defaultProps} success={true} />,
    );

    expect(getByText(/otp code sent/i)).toBeTruthy();
  });

  it('shows loading state', () => {
    const { getByRole } = render(
      <PatientOTPRequestForm {...defaultProps} loading={true} />,
    );

    expect(getByRole('button', { name: /sending/i })).toBeTruthy();
  });

  it('preserves email when provided as initialEmail', () => {
    const { getByPlaceholderText } = render(
      <PatientOTPRequestForm {...defaultProps} initialEmail="patient@example.com" />,
    );

    const input = getByPlaceholderText(/enter your email/i);
    expect(input.props.value).toBe('patient@example.com');
  });
});
