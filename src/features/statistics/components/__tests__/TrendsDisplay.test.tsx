import { render } from '@testing-library/react-native';
import React from 'react';
import { TrendsDisplay } from '../TrendsDisplay';

const renderTrendsDisplay = (overrideProps: Partial<any> = {}) => {
  const props = {
    statistics: null,
    isLoading: false,
    error: null,
    ...overrideProps,
  };

  const utils = render(<TrendsDisplay {...props} />);

  return {
    ...utils,
    props,
  };
};

describe('TrendsDisplay', () => {
  it('shows loading state', () => {
    const { getByText } = renderTrendsDisplay({ isLoading: true });

    expect(getByText(/loading statistics/i)).toBeTruthy();
  });

  it('shows error message', () => {
    const { getByText } = renderTrendsDisplay({
      error: 'Failed to load statistics',
    });

    expect(getByText(/failed to load statistics/i)).toBeTruthy();
  });

  it('shows empty state when no statistics', () => {
    const { getByText } = renderTrendsDisplay({ statistics: null });

    expect(getByText(/no check-in data available/i)).toBeTruthy();
  });

  it('displays statistics summary', () => {
    const mockStatistics = {
      totalCheckIns: 5,
      dateRange: {
        start: '2025-01-15',
        end: '2025-01-19',
      },
      averages: {
        bleeding: 2.5,
        pain: 1.5,
      },
      trends: {
        bleeding: [
          { date: '2025-01-15', value: 3 },
          { date: '2025-01-16', value: 2 },
        ],
        pain: [
          { date: '2025-01-15', value: 2 },
          { date: '2025-01-16', value: 1 },
        ],
        mouthFeeling: [
          { date: '2025-01-15', value: 'Good' },
          { date: '2025-01-16', value: 'Excellent' },
        ],
        hygieneHabits: [
          { date: '2025-01-15', value: 'interdental brush' },
          { date: '2025-01-16', value: 'interdental brush, floss' },
        ],
      },
    };

    const { getByText } = renderTrendsDisplay({ statistics: mockStatistics });

    expect(getByText(/total check-ins/i)).toBeTruthy();
    expect(getByText('5')).toBeTruthy();
    expect(getByText(/avg\. bleeding/i)).toBeTruthy();
    expect(getByText(/avg\. pain/i)).toBeTruthy();
    expect(getByText(/bleeding trend/i)).toBeTruthy();
    expect(getByText(/pain trend/i)).toBeTruthy();
  });

  it('handles statistics with zero check-ins', () => {
    const mockStatistics = {
      totalCheckIns: 0,
      dateRange: {
        start: '2025-01-15',
        end: '2025-01-19',
      },
      averages: {},
      trends: {
        bleeding: [],
        pain: [],
        mouthFeeling: [],
        hygieneHabits: [],
      },
    };

    const { getByText } = renderTrendsDisplay({ statistics: mockStatistics });

    expect(getByText(/no check-in data available/i)).toBeTruthy();
  });
});




