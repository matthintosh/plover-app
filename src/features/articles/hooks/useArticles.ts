import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { ArticleService } from '../service/article.service';
import type { Article } from '../service/types';

export interface UseArticlesOptions {
  limit?: number;
  offset?: number;
  enabled?: boolean;
}

export interface UseArticlesResult {
  articles: Article[];
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useArticles = ({
  limit,
  offset,
  enabled = true,
}: UseArticlesOptions = {}): UseArticlesResult => {
  const articleService = useMemo(() => new ArticleService(), []);

  const articlesQuery = useQuery<Article[], Error>({
    queryKey: ['articles', 'published', limit, offset],
    queryFn: () => articleService.getPublishedArticles(limit, offset),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const refetch = async () => {
    await articlesQuery.refetch();
  };

  return {
    articles: articlesQuery.data ?? [],
    isLoading: articlesQuery.isLoading,
    isFetching: articlesQuery.isFetching,
    error: articlesQuery.error ?? null,
    refetch,
  };
};

export interface UseArticleOptions {
  articleId?: string | null;
  enabled?: boolean;
}

export interface UseArticleResult {
  article: Article | null;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useArticle = ({
  articleId,
  enabled = true,
}: UseArticleOptions): UseArticleResult => {
  const articleService = useMemo(() => new ArticleService(), []);
  const isEnabled = enabled && !!articleId;

  const articleQuery = useQuery<Article | null, Error>({
    queryKey: ['articles', 'by-id', articleId],
    queryFn: () => articleService.getArticleById(articleId as string),
    enabled: isEnabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const refetch = async () => {
    if (!articleId) {
      return;
    }

    await articleQuery.refetch();
  };

  return {
    article: articleQuery.data ?? null,
    isLoading: articleQuery.isLoading,
    isFetching: articleQuery.isFetching,
    error: articleQuery.error ?? null,
    refetch,
  };
};



