import { render } from '@testing-library/react-native';
import React from 'react';
import { ArticleCard } from '../ArticleCard';

jest.mock('expo-router', () => ({
  Link: ({ children, ...props }: any) => {
    const React = require('react');
    return React.createElement('a', props, children);
  },
}));

const renderArticleCard = (overrideProps: Partial<any> = {}) => {
  const props = {
    article: {
      id: 'article-1',
      title: 'Test Article',
      content: 'Test content',
      publishedAt: '2025-01-15T10:00:00Z',
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-01-15T10:00:00Z',
    },
    ...overrideProps,
  };

  const utils = render(<ArticleCard {...props} />);

  return {
    ...utils,
    props,
  };
};

describe('ArticleCard', () => {
  it('renders article title', () => {
    const { getByText } = renderArticleCard();

    expect(getByText('Test Article')).toBeTruthy();
  });

  it('renders article category when provided', () => {
    const { getByText } = renderArticleCard({
      article: {
        id: 'article-1',
        title: 'Test Article',
        content: 'Test content',
        category: 'prevention',
        publishedAt: '2025-01-15T10:00:00Z',
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-01-15T10:00:00Z',
      },
    });

    expect(getByText('prevention')).toBeTruthy();
  });

  it('renders formatted date', () => {
    const { getByText } = renderArticleCard();

    // Check for date format (e.g., "Jan 15, 2025")
    expect(getByText(/Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/)).toBeTruthy();
  });
});

