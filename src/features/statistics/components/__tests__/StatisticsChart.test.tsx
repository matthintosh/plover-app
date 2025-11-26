import { render } from '@testing-library/react-native';
import React from 'react';
import { StatisticsChart } from '../StatisticsChart';

const renderStatisticsChart = (overrideProps: Partial<any> = {}) => {
  const props = {
    title: 'Test Chart',
    data: [],
    ...overrideProps,
  };

  const utils = render(<StatisticsChart {...props} />);

  return {
    ...utils,
    props,
  };
};

describe('StatisticsChart', () => {
  it('renders chart title', () => {
    const { getByText } = renderStatisticsChart({
      data: [
        { date: '2025-01-15', value: 3 },
        { date: '2025-01-16', value: 2 },
      ],
    });

    expect(getByText('Test Chart')).toBeTruthy();
  });

  it('renders numeric data as bars', () => {
    const { getByText } = renderStatisticsChart({
      title: 'Bleeding Trend',
      data: [
        { date: '2025-01-15', value: 3 },
        { date: '2025-01-16', value: 2 },
      ],
      maxValue: 10,
    });

    expect(getByText('3')).toBeTruthy();
    expect(getByText('2')).toBeTruthy();
  });

  it('renders non-numeric data as text', () => {
    const { getByText } = renderStatisticsChart({
      title: 'Mouth Feeling',
      data: [
        { date: '2025-01-15', value: 'Good' },
        { date: '2025-01-16', value: 'Excellent' },
      ],
    });

    expect(getByText('Good')).toBeTruthy();
    expect(getByText('Excellent')).toBeTruthy();
  });

  it('returns null when data is empty', () => {
    const { queryByText } = renderStatisticsChart({
      data: [],
    });

    expect(queryByText('Test Chart')).toBeNull();
  });

  it('displays unit label when provided', () => {
    const { getByText } = renderStatisticsChart({
      data: [{ date: '2025-01-15', value: 3 }],
      unit: 'out of 10',
    });

    expect(getByText(/Scale: 0-10 out of 10/i)).toBeTruthy();
  });
});






