import { render, fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';
import { OnboardingQuestionnaire } from '../OnboardingQuestionnaire';

const renderOnboardingQuestionnaire = (overrideProps: Partial<any> = {}) => {
  const props = {
    onSubmit: jest.fn(),
    isLoading: false,
    error: null,
    ...overrideProps,
  };

  const utils = render(<OnboardingQuestionnaire {...props} />);

  return {
    ...utils,
    props,
  };
};

describe('OnboardingQuestionnaire', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields', () => {
    const { getByPlaceholderText, getByText } = renderOnboardingQuestionnaire();

    expect(getByPlaceholderText(/age/i)).toBeTruthy();
    expect(getByPlaceholderText(/diet/i)).toBeTruthy();
    expect(getByPlaceholderText(/sleep/i)).toBeTruthy();
    expect(getByText(/bruxism/i)).toBeTruthy();
    expect(getByText(/submit/i)).toBeTruthy();
  });

  it('validates required fields', async () => {
    const onSubmit = jest.fn();
    const { getByText } = renderOnboardingQuestionnaire({ onSubmit });

    const submitButton = getByText(/submit/i);
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  it('submits form with valid data', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const { getByPlaceholderText, getByText } = renderOnboardingQuestionnaire({
      onSubmit,
    });

    const ageInput = getByPlaceholderText(/age/i);
    const dietInput = getByPlaceholderText(/diet/i);
    const sleepInput = getByPlaceholderText(/sleep/i);
    const submitButton = getByText(/submit/i);

    fireEvent.changeText(ageInput, '35');
    fireEvent.changeText(dietInput, 'Balanced diet');
    fireEvent.changeText(sleepInput, '7-8 hours');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        age: 35,
        diet: 'Balanced diet',
        sleep: '7-8 hours',
        bruxismClenching: false,
      });
    });
  });

  it('shows loading state when submitting', () => {
    const { UNSAFE_getByType } = renderOnboardingQuestionnaire({ isLoading: true });

    const ActivityIndicator = require('react-native').ActivityIndicator;
    const indicator = UNSAFE_getByType(ActivityIndicator);
    expect(indicator).toBeTruthy();
  });

  it('displays error message when provided', () => {
    const { getByText } = renderOnboardingQuestionnaire({
      error: 'Onboarding already completed',
    });

    expect(getByText(/onboarding already completed/i)).toBeTruthy();
  });

  it('handles bruxism toggle', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const { getByPlaceholderText, getByText, UNSAFE_getByType } = renderOnboardingQuestionnaire({
      onSubmit,
    });

    const ageInput = getByPlaceholderText(/age/i);
    const dietInput = getByPlaceholderText(/diet/i);
    const sleepInput = getByPlaceholderText(/sleep/i);
    const submitButton = getByText(/submit/i);

    fireEvent.changeText(ageInput, '35');
    fireEvent.changeText(dietInput, 'Balanced diet');
    fireEvent.changeText(sleepInput, '7-8 hours');
    
    // Find Switch component and toggle it
    const Switch = require('react-native').Switch;
    const switchComponent = UNSAFE_getByType(Switch);
    fireEvent(switchComponent, 'valueChange', true);
    
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        age: 35,
        diet: 'Balanced diet',
        sleep: '7-8 hours',
        bruxismClenching: true,
      });
    });
  });
});

