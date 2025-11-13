import React from 'react';
import { render } from '@testing-library/react-native';
import { RiskFactorsDisplay, RiskFactorsDisplayProps } from '../RiskFactorsDisplay';

const renderRiskFactorsDisplay = (overrideProps: Partial<RiskFactorsDisplayProps> = {}) => {
  const props: RiskFactorsDisplayProps = {
    riskFactors: [],
    isLoading: false,
    error: null,
    ...overrideProps,
  };

  const utils = render(<RiskFactorsDisplay {...props} />);

  return {
    ...utils,
    props,
  };
};

describe('RiskFactorsDisplay', () => {
  it('renders list of risk factors', () => {
    const { getByText } = renderRiskFactorsDisplay({
      riskFactors: [
        {
          id: 'risk-1',
          patientId: 'patient-1',
          type: 'diabetes',
          details: null,
          enteredBy: 'periodontist-1',
          enteredAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-02T00:00:00Z',
        },
        {
          id: 'risk-2',
          patientId: 'patient-1',
          type: 'tobacco_use',
          details: { level: 'above_10' },
          enteredBy: 'periodontist-1',
          enteredAt: '2025-01-03T00:00:00Z',
          updatedAt: '2025-01-04T00:00:00Z',
        },
      ],
    });

    expect(getByText(/diabetes/i)).toBeTruthy();
    expect(getByText(/tobacco use/i)).toBeTruthy();
    expect(getByText(/above 10/i)).toBeTruthy();
  });

  it('shows empty state when no risk factors exist', () => {
    const { getByText } = renderRiskFactorsDisplay({ riskFactors: [] });

    expect(getByText(/no risk factors recorded yet/i)).toBeTruthy();
  });

  it('shows loading state when fetching risk factors', () => {
    const { getByText } = renderRiskFactorsDisplay({ isLoading: true });

    expect(getByText(/loading risk factors/i)).toBeTruthy();
  });
});

