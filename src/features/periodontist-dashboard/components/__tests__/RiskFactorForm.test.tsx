import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { RiskFactorForm, RiskFactorFormProps } from '../RiskFactorForm';

const renderRiskFactorForm = (overrideProps: Partial<RiskFactorFormProps> = {}) => {
  const props: RiskFactorFormProps = {
    loading: false,
    error: null,
    onSubmit: jest.fn(),
    onRemove: jest.fn(),
    existingRiskFactors: [],
    ...overrideProps,
  };

  const result = render(<RiskFactorForm {...props} />);

  return {
    ...result,
    props,
  };
};

describe('RiskFactorForm', () => {
  it('submits diabetes risk factor without details', async () => {
    const { getByText, props } = renderRiskFactorForm();

    fireEvent.press(getByText(/diabetes/i));
    fireEvent.press(getByText(/add risk factor/i));

    await waitFor(() => {
      expect(props.onSubmit).toHaveBeenCalledWith({
        type: 'diabetes',
        details: {},
      });
    });
  });

  it('requires tobacco level when tobacco use selected', async () => {
    const { getByText, queryByText, props } = renderRiskFactorForm();

    fireEvent.press(getByText(/tobacco use/i));
    fireEvent.press(getByText(/add risk factor/i));

    expect(props.onSubmit).not.toHaveBeenCalled();
    expect(getByText(/select tobacco usage level/i)).toBeTruthy();

    fireEvent.press(getByText(/above 10 cigarettes/i));
    fireEvent.press(getByText(/add risk factor/i));

    await waitFor(() => {
      expect(props.onSubmit).toHaveBeenLastCalledWith({
        type: 'tobacco_use',
        details: { level: 'above_10' },
      });
    });

    expect(queryByText(/select tobacco usage level/i)).toBeNull();
  });
});

