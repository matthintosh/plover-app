import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LinearBackground } from '@/components/ui/LinearBackground';
import { SkeletonText } from '@/components/ui/Skeleton';
import { Colors, Spacing } from '@/constants/theme';
import { ArticleCard } from '@/features/articles/components/ArticleCard';
import { useArticles } from '@/features/articles/hooks/useArticles';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { useCheckIn } from '@/features/daily-check-in/hooks/useCheckIn';
import { DateRangeSelector } from '@/features/statistics/components/DateRangeSelector';
import { EmptyState } from '@/features/statistics/components/EmptyState';
import { TrendsDisplay } from '@/features/statistics/components/TrendsDisplay';
import { useStatistics } from '@/features/statistics/hooks/useStatistics';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const router = useRouter();
  const { patient, isAuthenticated, userType, isLoading: authLoading } = useAuth();

  // Get today's date
  const today = new Date();
  const todayDateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const {
    checkIn,
    isLoading: checkInLoading,
  } = useCheckIn({
    patientId: patient?.id,
    date: todayDateString,
    enabled: !!patient?.id && isAuthenticated && userType === 'patient',
  });

  const hasCheckedInToday = !!checkIn;

  // Statistics date range state
  const [statisticsStartDate, setStatisticsStartDate] = useState<string>(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    const year = thirtyDaysAgo.getFullYear();
    const month = String(thirtyDaysAgo.getMonth() + 1).padStart(2, '0');
    const day = String(thirtyDaysAgo.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  const [statisticsEndDate, setStatisticsEndDate] = useState<string>(todayDateString);

  const {
    statistics,
    isLoading: statisticsLoading,
    error: statisticsError,
  } = useStatistics({
    patientId: patient?.id,
    startDate: statisticsStartDate,
    endDate: statisticsEndDate,
    enabled: !!patient?.id && isAuthenticated && userType === 'patient',
  });

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setStatisticsStartDate(startDate);
    setStatisticsEndDate(endDate);
  };

  // Get articles for thumbnail gallery (limit to 3)
  const {
    articles: featuredArticles,
    isLoading: articlesLoading,
  } = useArticles({
    limit: 3,
    enabled: isAuthenticated && userType === 'patient',
  });

  if (authLoading) {
    return (
      <View style={[styles.container, { backgroundColor: palette.background }]}>
        <Text style={[styles.loadingText, { color: palette.textSecondary }]}>Loading...</Text>
      </View>
    );
  }

  if (!isAuthenticated || userType !== 'patient') {
    return (
      <View style={[styles.container, { backgroundColor: palette.background }]}>
        <Text style={[styles.welcomeText, { color: palette.text }]}>Welcome to Plover</Text>
        <Text style={[styles.subtitleText, { color: palette.textSecondary }]}>
          Please log in to access your dashboard.
        </Text>
      </View>
    );
  }

  return (
    <LinearBackground>
    <ScrollView
      style={[styles.container]}
      contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={[styles.welcomeText, { color: palette.text }]}>
          Welcome{patient?.fullName ? `, ${patient.fullName}` : patient?.email ? `, ${patient.email.split('@')[0]}` : ''}!
        </Text>
        <Text style={[styles.subtitleText, { color: palette.textSecondary }]}>
          Track your daily symptoms and habits.
        </Text>
      </View>

      <Card style={styles.checkInCard}>
        <View style={styles.checkInContent}>
          <View style={styles.checkInHeader}>
            <Text style={[styles.checkInTitle, { color: palette.text }]}>Daily Check-in</Text>
            {hasCheckedInToday && (
              <View style={[styles.badge, { backgroundColor: palette.primary + '20' }]}>
                <Text style={[styles.badgeText, { color: palette.primary }]}>Completed</Text>
              </View>
            )}
          </View>
          <Text style={[styles.checkInDescription, { color: palette.textSecondary }]}>
            {hasCheckedInToday
              ? 'You\'ve completed your check-in for today. You can update it anytime.'
              : 'Log your symptoms and habits for today to track your progress.'}
          </Text>
          <Button
            title={hasCheckedInToday ? 'Update Check-in' : 'Start Check-in'}
            onPress={() => router.push('/(tabs)/check-in')}
            variant="primary"
            fullWidth
            style={styles.checkInButton}
          />
        </View>
      </Card>

      {/* Statistics Section */}
      <Card style={styles.statisticsCard}>
        <View style={styles.statisticsHeader}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>Statistics & Trends</Text>
        </View>
        <DateRangeSelector
          startDate={statisticsStartDate}
          endDate={statisticsEndDate}
          onDateRangeChange={handleDateRangeChange}
        />
        {statisticsLoading ? (
          <View style={styles.statisticsLoading}>
            <SkeletonText lines={4} width="100%" lastLineWidth="60%" lineHeight={16} spacing={12} />
          </View>
        ) : statisticsError ? (
          <View style={styles.statisticsError}>
            <Text style={[styles.errorText, { color: palette.error }]}>
              {statisticsError.message || 'Failed to load statistics'}
            </Text>
          </View>
        ) : statistics && statistics.totalCheckIns > 0 ? (
          <TrendsDisplay statistics={statistics} />
        ) : (
          <EmptyState
            title="No Statistics Available"
            message="Complete your first daily check-in to see statistics and trends."
          />
        )}
      </Card>

      {/* Articles Section */}
      {featuredArticles.length > 0 && (
        <Card style={styles.articlesCard}>
          <View style={styles.articlesHeader}>
            <Text style={[styles.sectionTitle, { color: palette.text }]}>Articles</Text>
            <Button
              title="View All"
              onPress={() => router.push('/(tabs)/articles')}
              variant="secondary"
              style={styles.viewAllButton}
            />
          </View>
          <View style={styles.articlesGrid}>
            {featuredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </View>
        </Card>
      )}
    </ScrollView>
    </LinearBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  header: {
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.text,
  },
  subtitleText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  checkInCard: {
    marginBottom: Spacing.md,
  },
  checkInContent: {
    gap: Spacing.md,
  },
  checkInHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkInTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  checkInDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  checkInButton: {
    marginTop: Spacing.sm,
  },
  section: {
    gap: Spacing.xs,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  sectionText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  statisticsCard: {
    marginTop: Spacing.md,
  },
  statisticsHeader: {
    marginBottom: Spacing.md,
  },
  statisticsLoading: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  statisticsError: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: Colors.light.error,
    textAlign: 'center',
  },
  articlesCard: {
    marginTop: Spacing.md,
  },
  articlesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  viewAllButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  articlesGrid: {
    gap: Spacing.md,
  },
});
