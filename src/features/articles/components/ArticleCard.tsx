import { Colors, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Link } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import type { Article } from '../service/types';

export interface ArticleCardProps {
  article: Article;
  onPress?: () => void;
}

export function ArticleCard({ article, onPress }: ArticleCardProps) {
  const colorScheme =
    useThemeColor({}, 'background') === Colors.light.background ? 'light' : 'dark';
  // Extract color values as plain strings to avoid Proxy issues in React Native Web
  const colorPalette = Colors[colorScheme];
  const colors = {
    primary: String(colorPalette.primary),
    text: String(colorPalette.text),
    textSecondary: String(colorPalette.textSecondary),
    surface: String(colorPalette.surface),
    border: String(colorPalette.border),
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };


  return (
    <Link href={`/(tabs)/articles/${article.id}`} asChild>
      <TouchableOpacity
        style={styles.card}
        onPress={handlePress}
        activeOpacity={0.7}>
        {article.thumbnailUrl && (
          <Image source={{ uri: article.thumbnailUrl }} style={styles.thumbnail} />
        )}
        <View style={styles.content}>
          {article.category && (
            <Text style={[styles.category, { color: colors.primary }]}>{article.category}</Text>
          )}
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
            {article.title}
          </Text>
          <Text style={[styles.date, { color: colors.textSecondary }]}>
            {new Date(article.publishedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.md,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    backgroundColor: Colors.light.surface,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  category: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: Colors.light.primary,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    lineHeight: 22,
  },
  date: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
});





