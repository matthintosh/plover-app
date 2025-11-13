import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginForm, LoginFormProps } from '../LoginForm';

const renderLoginForm = (overrideProps: Partial<LoginFormProps> = {}) => {
  const props: LoginFormProps = {
    onSubmit: jest.fn(),
    loading: false,
    error: null,
    ...overrideProps,
  };

  const utils = render(<LoginForm {...props} />);

  return {
    ...utils,
    props,
  };
};

describe('LoginForm', () => {
  it('renders email and password inputs', () => {
    const { getByPlaceholderText } = renderLoginForm();

    expect(getByPlaceholderText(/email/i)).toBeTruthy();
    expect(getByPlaceholderText(/password/i)).toBeTruthy();
  });

  it('submits form with entered credentials', async () => {
    const { getByPlaceholderText, getByRole, props } = renderLoginForm();

    fireEvent.changeText(getByPlaceholderText(/email/i), 'dr@example.com');
    fireEvent.changeText(getByPlaceholderText(/password/i), 'secure-password');

    fireEvent.press(getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(props.onSubmit).toHaveBeenCalledWith({
        email: 'dr@example.com',
        password: 'secure-password',
      });
    });
  });

  it('shows validation errors when submitting empty form', async () => {
    const { getByRole, findByText } = renderLoginForm();

    fireEvent.press(getByRole('button', { name: /sign in/i }));

    expect(await findByText(/email is required/i)).toBeTruthy();
    expect(await findByText(/password is required/i)).toBeTruthy();
  });

  it('shows authentication error message', () => {
    const { getByText } = renderLoginForm({ error: 'Invalid credentials' });

    expect(getByText(/invalid credentials/i)).toBeTruthy();
  });
});
