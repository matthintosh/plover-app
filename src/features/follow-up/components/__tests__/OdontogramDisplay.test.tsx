import { render } from '@testing-library/react-native';
import React from 'react';
import { OdontogramDisplay } from '../OdontogramDisplay';

const renderOdontogramDisplay = (overrideProps: Partial<any> = {}) => {
  const props = {
    odontogram: null,
    isLoading: false,
    error: null,
    ...overrideProps,
  };

  const utils = render(<OdontogramDisplay {...props} />);

  return {
    ...utils,
    props,
  };
};

describe('OdontogramDisplay', () => {
  it('shows loading state', () => {
    const { getByText } = renderOdontogramDisplay({ isLoading: true });

    expect(getByText(/loading odontogram/i)).toBeTruthy();
  });

  it('shows error message', () => {
    const { getByText } = renderOdontogramDisplay({
      error: 'Failed to load odontogram',
    });

    expect(getByText(/failed to load odontogram/i)).toBeTruthy();
  });

  it('shows empty state when no odontogram', () => {
    const { getByText } = renderOdontogramDisplay({ odontogram: null });

    expect(getByText(/no odontogram data available/i)).toBeTruthy();
  });

  it('displays odontogram spaces', () => {
    const mockOdontogram = {
      id: 'odo-1',
      spaces: [
        { spaceId: '1-2', toolType: 'interdental_brush', brushSize: '0.5mm' },
        { spaceId: '2-3', toolType: 'floss' },
      ],
    };

    const { getByText } = renderOdontogramDisplay({ odontogram: mockOdontogram });

    expect(getByText('Odontogram')).toBeTruthy();
    expect(getByText('1-2')).toBeTruthy();
    expect(getByText('2-3')).toBeTruthy();
    // Check that tool types are displayed (either interdental brush or floss)
    const hasToolType = getByText(/Interdental Brush/i) || getByText(/Floss/i);
    expect(hasToolType).toBeTruthy();
  });

  it('displays all 31 spaces', () => {
    const spaces = [];
    for (let i = 1; i <= 31; i++) {
      spaces.push({
        spaceId: `${i}-${i + 1}`,
        toolType: 'interdental_brush' as const,
        brushSize: '0.5mm',
      });
    }

    const mockOdontogram = {
      id: 'odo-1',
      spaces,
    };

    const { getByText } = renderOdontogramDisplay({ odontogram: mockOdontogram });

    expect(getByText('1-2')).toBeTruthy();
    // Check that at least some spaces are rendered
    expect(getByText('31-32')).toBeTruthy();
  });
});

