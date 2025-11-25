import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Redirect, useLocalSearchParams } from 'expo-router';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { useArticle } from '@/features/articles/hooks/useArticles';
import { ArticleDetail } from '@/features/articles/components/ArticleDetail';

export default function ArticleDetailScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const params = useLocalSearchParams<{ id: string }>();
  const { isAuthenticated, userType, isLoading: authLoading } = useAuth();

  const articleId = Array.isArray(params.id) ? params.id[0] : params.id ?? null;

  const {
    article,
    isLoading,
    error,
  } = useArticle({
    articleId,
    enabled: !!articleId && isAuthenticated && userType === 'patient',
  });

  if (authLoading) {
    return (
      <View style={[styles.container, { backgroundColor: palette.background }]}>
        {/* Loading handled by ArticleDetail */}
      </View>
    );
  }

  if (!isAuthenticated || userType !== 'patient') {
    return <Redirect href={{ pathname: '/(auth)/login' }} />;
  }

  if (!articleId) {
    return <Redirect href={{ pathname: '/(tabs)/articles' }} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <ArticleDetail article={article} isLoading={isLoading} error={error} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
});



