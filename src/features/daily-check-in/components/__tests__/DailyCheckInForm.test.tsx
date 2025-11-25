import { render, fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';
import { DailyCheckInForm } from '../DailyCheckInForm';

const renderDailyCheckInForm = (overrideProps: Partial<any> = {}) => {
  const props = {
    onSubmit: jest.fn(),
    isLoading: false,
    error: null,
    existingCheckIn: null,
    ...overrideProps,
  };

  const utils = render(<DailyCheckInForm {...props} />);

  return {
    ...utils,
    props,
  };
};

describe('DailyCheckInForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields', () => {
    const { getByPlaceholderText, getByText } = renderDailyCheckInForm();

    expect(getByPlaceholderText(/bleeding level/i)).toBeTruthy();
    expect(getByPlaceholderText(/pain level/i)).toBeTruthy();
    expect(getByPlaceholderText(/how does your mouth feel/i)).toBeTruthy();
    expect(getByText(/Interdental Brush Used/i)).toBeTruthy();
    expect(getByText(/Floss Used/i)).toBeTruthy();
    expect(getByText(/submit/i)).toBeTruthy();
  });

  it('pre-fills form with existing check-in data', () => {
    const existingCheckIn = {
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
    };

    const { getByDisplayValue } = renderDailyCheckInForm({
      existingCheckIn,
    });

    expect(getByDisplayValue('3')).toBeTruthy();
    expect(getByDisplayValue('2')).toBeTruthy();
    expect(getByDisplayValue('Good')).toBeTruthy();
  });

  it('validates bleeding range', async () => {
    const onSubmit = jest.fn();
    const { getByPlaceholderText, getByText } = renderDailyCheckInForm({
      onSubmit,
    });

    const bleedingInput = getByPlaceholderText(/bleeding level/i);
    const submitButton = getByText(/submit/i);

    fireEvent.changeText(bleedingInput, '11');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  it('submits form with valid data', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const { getByPlaceholderText, getByText, UNSAFE_getAllByType } = renderDailyCheckInForm({
      onSubmit,
    });

    const bleedingInput = getByPlaceholderText(/bleeding level/i);
    const painInput = getByPlaceholderText(/pain level/i);
    const mouthFeelingInput = getByPlaceholderText(/how does your mouth feel/i);
    const submitButton = getByText(/submit/i);

    fireEvent.changeText(bleedingInput, '3');
    fireEvent.changeText(painInput, '2');
    fireEvent.changeText(mouthFeelingInput, 'Good');

    // Toggle switches
    const Switch = require('react-native').Switch;
    const switches = UNSAFE_getAllByType(Switch);
    if (switches.length >= 1) {
      fireEvent(switches[0], 'valueChange', true); // interdental brush
    }
    if (switches.length >= 2) {
      fireEvent(switches[1], 'valueChange', true); // floss
    }

    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        bleeding: 3,
        pain: 2,
        mouthFeeling: 'Good',
        interdentalBrushUsed: true,
        flossUsed: true,
      });
    });
  });

  it('shows loading state when submitting', () => {
    const { UNSAFE_getByType } = renderDailyCheckInForm({ isLoading: true });

    const ActivityIndicator = require('react-native').ActivityIndicator;
    const indicator = UNSAFE_getByType(ActivityIndicator);
    expect(indicator).toBeTruthy();
  });

  it('displays error message when provided', () => {
    const { getByText } = renderDailyCheckInForm({
      error: 'Failed to save check-in',
    });

    expect(getByText(/failed to save check-in/i)).toBeTruthy();
  });
});

