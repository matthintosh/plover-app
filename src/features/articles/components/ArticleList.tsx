import { Colors, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { ArticleCard } from './ArticleCard';
import { SkeletonCard } from '@/components/ui/Skeleton';
import type { Article } from '../service/types';

export interface ArticleListProps {
  articles: Article[];
  isLoading?: boolean;
  isFetching?: boolean;
  error?: Error | null;
  onRefresh?: () => void;
  onEndReached?: () => void;
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
}

export function ArticleList({
  articles,
  isLoading = false,
  isFetching = false,
  error = null,
  onRefresh,
  onEndReached,
  ListEmptyComponent,
}: ArticleListProps) {
  const colorScheme =
    useThemeColor({}, 'background') === Colors.light.background ? 'light' : 'dark';
  // Extract color values as plain strings to avoid Proxy issues in React Native Web
  const colorPalette = Colors[colorScheme];
  const colors = {
    primary: String(colorPalette.primary),
    text: String(colorPalette.text),
    textSecondary: String(colorPalette.textSecondary),
    error: String(colorPalette.error),
  };

  if (isLoading && articles.length === 0) {
    return (
      <View style={styles.listContent}>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading articles...
        </Text>
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonCard
            key={index}
            showAvatar={false}
            showTitle={true}
            showDescription={true}
            descriptionLines={2}
          />
        ))}
      </View>
    );
  }

  if (error && articles.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          {error.message || 'Failed to load articles'}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={articles}
      renderItem={({ item }) => <ArticleCard article={item} />}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={isFetching} onRefresh={onRefresh} tintColor={colors.primary} />
        ) : undefined
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={
        ListEmptyComponent || (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No articles available.
            </Text>
          </View>
        )
      }
      ListFooterComponent={
        isFetching && articles.length > 0 ? (
          <View style={styles.footer}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: Spacing.lg,
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
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  footer: {
    padding: Spacing.md,
    alignItems: 'center',
  },
});


