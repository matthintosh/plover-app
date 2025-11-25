import { Colors, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { Article } from '../service/types';

export interface ArticleDetailProps {
  article: Article | null;
  isLoading?: boolean;
  error?: Error | null;
}

export function ArticleDetail({ article, isLoading = false, error = null }: ArticleDetailProps) {
  const colorScheme =
    useThemeColor({}, 'background') === Colors.light.background ? 'light' : 'dark';
  const colors = Colors[colorScheme];

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading article...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          {error.message || 'Failed to load article'}
        </Text>
      </View>
    );
  }

  if (!article) {
    return (
      <View style={styles.centerContainer}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Article not found.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {article.thumbnailUrl && (
        <Image source={{ uri: article.thumbnailUrl }} style={styles.thumbnail} />
      )}
      <View style={styles.header}>
        {article.category && (
          <Text style={[styles.category, { color: colors.primary }]}>{article.category}</Text>
        )}
        <Text style={[styles.title, { color: colors.text }]}>{article.title}</Text>
        <Text style={[styles.date, { color: colors.textSecondary }]}>
          {new Date(article.publishedAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.contentText, { color: colors.text }]}>{article.content}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: Spacing.xl,
  },
  thumbnail: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  header: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  category: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: Colors.light.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    lineHeight: 32,
  },
  date: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.light.text,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    color: Colors.light.error,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
});



