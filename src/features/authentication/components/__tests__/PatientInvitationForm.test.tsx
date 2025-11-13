import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { PatientInvitationForm, PatientInvitationFormProps } from '../PatientInvitationForm';

const renderComponent = (overrideProps: Partial<PatientInvitationFormProps> = {}) => {
  const props: PatientInvitationFormProps = {
    onSubmit: jest.fn(),
    loading: false,
    error: null,
    ...overrideProps,
  };

  const utils = render(<PatientInvitationForm {...props} />);

  return { ...utils, props };
};

describe('PatientInvitationForm', () => {
  it('renders email input and submit button', () => {
    const { getByPlaceholderText, getByRole } = renderComponent();

    expect(getByPlaceholderText(/patient email/i)).toBeTruthy();
    expect(getByRole('button', { name: /send invitation/i })).toBeTruthy();
  });

  it('calls onSubmit with email address', async () => {
    const { getByPlaceholderText, getByRole, props } = renderComponent();

    fireEvent.changeText(getByPlaceholderText(/patient email/i), 'patient@example.com');
    fireEvent.press(getByRole('button', { name: /send invitation/i }));

    await waitFor(() => {
      expect(props.onSubmit).toHaveBeenCalledWith({ email: 'patient@example.com' });
    });
  });

  it('validates email field', async () => {
    const { getByRole, findByText } = renderComponent();

    fireEvent.press(getByRole('button', { name: /send invitation/i }));

    expect(await findByText(/email is required/i)).toBeTruthy();
  });

  it('validates email format', async () => {
    const { getByPlaceholderText, getByRole, findByText } = renderComponent();

    fireEvent.changeText(getByPlaceholderText(/patient email/i), 'invalid-email');
    fireEvent.press(getByRole('button', { name: /send invitation/i }));

    expect(await findByText(/enter a valid email address/i)).toBeTruthy();
  });

  it('displays server error message', () => {
    const { getByText } = renderComponent({ error: 'Invitation failed' });

    expect(getByText(/invitation failed/i)).toBeTruthy();
  });
});
