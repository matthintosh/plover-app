import { render } from '@testing-library/react-native';
import React from 'react';
import { ArticleList } from '../ArticleList';

jest.mock('expo-router', () => ({
  Link: ({ children, ...props }: any) => {
    const React = require('react');
    return React.createElement('a', props, children);
  },
}));

const renderArticleList = (overrideProps: Partial<any> = {}) => {
  const props = {
    articles: [],
    isLoading: false,
    isFetching: false,
    error: null,
    ...overrideProps,
  };

  const utils = render(<ArticleList {...props} />);

  return {
    ...utils,
    props,
  };
};

describe('ArticleList', () => {
  it('shows loading state', () => {
    const { getByText } = renderArticleList({ isLoading: true });

    expect(getByText(/loading articles/i)).toBeTruthy();
  });

  it('shows error message', () => {
    const { getByText } = renderArticleList({
      error: new Error('Failed to load articles'),
    });

    expect(getByText(/failed to load articles/i)).toBeTruthy();
  });

  it('shows empty state when no articles', () => {
    const { getByText } = renderArticleList({ articles: [] });

    expect(getByText(/no articles available/i)).toBeTruthy();
  });

  it('renders article cards', () => {
    const mockArticles = [
      {
        id: 'article-1',
        title: 'Article 1',
        content: 'Content 1',
        publishedAt: '2025-01-15T10:00:00Z',
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-01-15T10:00:00Z',
      },
      {
        id: 'article-2',
        title: 'Article 2',
        content: 'Content 2',
        publishedAt: '2025-01-16T10:00:00Z',
        createdAt: '2025-01-16T10:00:00Z',
        updatedAt: '2025-01-16T10:00:00Z',
      },
    ];

    const { getByText } = renderArticleList({ articles: mockArticles });

    expect(getByText('Article 1')).toBeTruthy();
    expect(getByText('Article 2')).toBeTruthy();
  });
});

