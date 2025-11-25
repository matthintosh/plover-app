import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { LinearBackground } from '@/components/ui/LinearBackground';
import { Colors, Spacing } from '@/constants/theme';
import { ArticleList } from '@/features/articles/components/ArticleList';
import { useArticles } from '@/features/articles/hooks/useArticles';
import type { Article } from '@/features/articles/service/types';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Redirect } from 'expo-router';

const ARTICLES_PER_PAGE = 10;

export default function ArticlesScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const { isAuthenticated, userType, isLoading: authLoading } = useAuth();
  const [offset, setOffset] = useState(0);
  const [allArticles, setAllArticles] = useState<Article[]>([]);

  const {
    articles,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useArticles({
    limit: ARTICLES_PER_PAGE,
    offset,
    enabled: isAuthenticated && userType === 'patient',
  });

  // Update all articles when new articles are loaded
  React.useEffect(() => {
    if (articles.length > 0) {
      if (offset === 0) {
        // Reset on refresh
        setAllArticles(articles);
      } else {
        // Append new articles
        setAllArticles((prev) => {
          const existingIds = new Set(prev.map((a) => a.id));
          const newArticles = articles.filter((a) => !existingIds.has(a.id));
          return [...prev, ...newArticles];
        });
      }
    }
  }, [articles, offset]);

  const handleRefresh = useCallback(async () => {
    setOffset(0);
    setAllArticles([]);
    await refetch();
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    if (!isFetching && articles.length === ARTICLES_PER_PAGE) {
      setOffset((prev) => prev + ARTICLES_PER_PAGE);
    }
  }, [isFetching, articles.length]);

  if (authLoading) {
    return (
      <View style={[styles.container, { backgroundColor: palette.background }]}>
        <Text style={[styles.loadingText, { color: palette.textSecondary }]}>Loading...</Text>
      </View>
    );
  }

  if (!isAuthenticated || userType !== 'patient') {
    return <Redirect href={{ pathname: '/(auth)/login' }} />;
  }

  return (
    <LinearBackground>
      <View style={styles.header}>
        <Text style={[styles.title, { color: palette.text }]}>Articles</Text>
        <Text style={[styles.subtitle, { color: palette.textSecondary }]}>
          Educational content about oral health and periodontal care
        </Text>
      </View>
      <ArticleList
        articles={allArticles}
        isLoading={isLoading && offset === 0}
        isFetching={isFetching}
        error={error}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
      />
    </LinearBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: Spacing.lg,
    gap: Spacing.xs,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.text,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});



