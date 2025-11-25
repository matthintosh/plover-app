import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { RecommendationForm } from '../RecommendationForm';

const renderRecommendationForm = (overrideProps: Partial<any> = {}) => {
  const props = {
    initialValues: undefined,
    loading: false,
    error: null,
    onSubmit: jest.fn(),
    ...overrideProps,
  };

  const utils = render(<RecommendationForm {...props} />);

  return {
    ...utils,
    props,
  };
};

describe('RecommendationForm', () => {
  it('renders form fields', () => {
    const { getByPlaceholderText, getByText } = renderRecommendationForm();

    expect(getByPlaceholderText(/e.g., soft/i)).toBeTruthy();
    expect(getByPlaceholderText(/brand name/i)).toBeTruthy();
    expect(getByPlaceholderText(/model name/i)).toBeTruthy();
    expect(getByText(/odontogram/i)).toBeTruthy();
  });

  it('populates initial values', () => {
    const initialValues = {
      toothbrushType: 'soft',
      toothbrushBrand: 'Brand A',
      toothbrushModel: 'Model X',
    };

    const { getByDisplayValue } = renderRecommendationForm({ initialValues });

    expect(getByDisplayValue('soft')).toBeTruthy();
    expect(getByDisplayValue('Brand A')).toBeTruthy();
    expect(getByDisplayValue('Model X')).toBeTruthy();
  });

  it('allows entering toothbrush information', () => {
    const { getByPlaceholderText } = renderRecommendationForm();
    const typeInput = getByPlaceholderText(/e.g., soft/i);

    fireEvent.changeText(typeInput, 'soft');

    expect(typeInput.props.value).toBe('soft');
  });

  it('allows selecting spaces for odontogram', () => {
    const { getAllByText } = renderRecommendationForm();

    // Find brush buttons (there should be multiple - one for each space)
    const brushButtons = getAllByText('Brush');
    expect(brushButtons.length).toBeGreaterThan(0);
  });

  it('validates that at least one field is provided', () => {
    const onSubmit = jest.fn();
    const { getByText, queryByText } = renderRecommendationForm({ onSubmit });

    const submitButton = getByText(/save recommendations/i);
    fireEvent.press(submitButton);

    // Should show validation error (check for error text)
    const errorText = queryByText(/please provide/i) || queryByText(/at least/i);
    expect(errorText).toBeTruthy();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', () => {
    const onSubmit = jest.fn();
    const { getByPlaceholderText, getByText } = renderRecommendationForm({ onSubmit });

    const typeInput = getByPlaceholderText(/e.g., soft/i);
    fireEvent.changeText(typeInput, 'soft');

    const submitButton = getByText(/save recommendations/i);
    fireEvent.press(submitButton);

    expect(onSubmit).toHaveBeenCalledWith({
      toothbrushType: 'soft',
      toothbrushBrand: undefined,
      toothbrushModel: undefined,
      odontogram: undefined,
    });
  });

  it('shows loading state', () => {
    const { getByText } = renderRecommendationForm({ loading: true });

    expect(getByText(/saving/i)).toBeTruthy();
  });

  it('displays error message', () => {
    const { getByText } = renderRecommendationForm({
      error: 'Failed to save recommendation',
    });

    expect(getByText(/failed to save recommendation/i)).toBeTruthy();
  });
});

