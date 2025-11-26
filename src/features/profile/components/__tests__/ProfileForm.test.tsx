import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { ProfileForm } from '../ProfileForm';

const renderProfileForm = (overrideProps: Partial<any> = {}) => {
  const props = {
    initialValues: undefined,
    loading: false,
    error: null,
    onSubmit: jest.fn(),
    ...overrideProps,
  };

  const utils = render(<ProfileForm {...props} />);

  return {
    ...utils,
    props,
  };
};

describe('ProfileForm', () => {
  it('renders form fields', () => {
    const { getByPlaceholderText, getByText } = renderProfileForm();

    expect(getByPlaceholderText(/full name/i)).toBeTruthy();
    expect(getByPlaceholderText(/email/i)).toBeTruthy();
    expect(getByPlaceholderText(/phone number/i)).toBeTruthy();
    expect(getByText(/save changes/i)).toBeTruthy();
  });

  it('populates initial values', () => {
    const initialValues = {
      fullName: 'John Doe',
      email: 'john@example.com',
      phoneNumber: '+1234567890',
    };

    const { getByDisplayValue } = renderProfileForm({ initialValues });

    expect(getByDisplayValue('John Doe')).toBeTruthy();
    expect(getByDisplayValue('john@example.com')).toBeTruthy();
    expect(getByDisplayValue('+1234567890')).toBeTruthy();
  });

  it('submits form with updated values', () => {
    const onSubmit = jest.fn();
    const { getByPlaceholderText, getByText } = renderProfileForm({ onSubmit });

    const nameInput = getByPlaceholderText(/full name/i);
    fireEvent.changeText(nameInput, 'Jane Doe');

    const submitButton = getByText(/save changes/i);
    fireEvent.press(submitButton);

    expect(onSubmit).toHaveBeenCalledWith({
      fullName: 'Jane Doe',
      email: undefined,
      phoneNumber: undefined,
    });
  });

  it('shows loading state', () => {
    const { getByText } = renderProfileForm({ loading: true });

    expect(getByText(/saving/i)).toBeTruthy();
  });

  it('displays error message', () => {
    const { getByText } = renderProfileForm({
      error: 'Failed to update profile',
    });

    expect(getByText(/failed to update profile/i)).toBeTruthy();
  });
});





