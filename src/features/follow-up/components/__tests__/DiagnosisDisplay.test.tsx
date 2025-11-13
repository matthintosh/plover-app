import { render } from '@testing-library/react-native';
import React from 'react';
import { DiagnosisDisplay, DiagnosisDisplayProps } from '../DiagnosisDisplay';

const renderDiagnosisDisplay = (overrideProps: Partial<DiagnosisDisplayProps> = {}) => {
  const props: DiagnosisDisplayProps = {
    diagnosis: null,
    isLoading: false,
    error: null,
    ...overrideProps,
  };

  const utils = render(<DiagnosisDisplay {...props} />);

  return {
    ...utils,
    props,
  };
};

describe('DiagnosisDisplay', () => {
  it('renders diagnosis details when data is present', () => {
    const { getByText } = renderDiagnosisDisplay({
      diagnosis: {
        id: 'diagnosis-1',
        patientId: 'patient-1',
        type: 'periodontitis',
        grade: 2,
        stage: 3,
        enteredBy: 'periodontist-1',
        enteredAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-02T00:00:00Z',
      },
    });

    expect(getByText(/periodontitis/i)).toBeTruthy();
    expect(getByText(/grade 2/i)).toBeTruthy();
    expect(getByText(/stage 3/i)).toBeTruthy();
  });

  it('shows empty state when no diagnosis exists', () => {
    const { getByText } = renderDiagnosisDisplay({ diagnosis: null });

    expect(getByText(/no diagnosis recorded yet/i)).toBeTruthy();
  });

  it('shows loading state when fetching diagnosis', () => {
    const { getByText } = renderDiagnosisDisplay({ isLoading: true });

    expect(getByText(/loading diagnosis/i)).toBeTruthy();
  });
});

