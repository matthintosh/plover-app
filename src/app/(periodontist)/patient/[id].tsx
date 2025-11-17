import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

 

import { Colors, Spacing } from '@/constants/theme';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import type { PatientProfile } from '@/features/authentication/repository/patient.repository.interface';
import { DiagnosisDisplay } from '@/features/follow-up/components/DiagnosisDisplay';
import { RiskFactorsDisplay } from '@/features/follow-up/components/RiskFactorsDisplay';
import { useFollowUp } from '@/features/follow-up/hooks/useFollowUp';
import type { Diagnosis } from '@/features/follow-up/service/types';
import { DiagnosisForm } from '@/features/periodontist-dashboard/components/DiagnosisForm';
import { RiskFactorForm } from '@/features/periodontist-dashboard/components/RiskFactorForm';
import { usePeriodontistDashboard } from '@/features/periodontist-dashboard/hooks/usePeriodontistDashboard';

export default function PatientDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const patientId = useMemo(() => {
    const idValue = params.id;
    return Array.isArray(idValue) ? idValue[0] : idValue ?? null;
  }, [params.id]);

  const { periodontist, isAuthenticated, userType, isLoading: authLoading } = useAuth();
  const {
    patients,
    createOrUpdateDiagnosis,
    addRiskFactor,
    removeRiskFactor,
  } = usePeriodontistDashboard({ periodontistId: periodontist?.id });

  const patient = useMemo(() => {
    return (
      patients.find((candidate: PatientProfile) => candidate.id === patientId) ?? null
    );
  }, [patients, patientId]);

  const {
    diagnosis,
    riskFactors,
    isLoading: followUpLoading,
    isFetching,
    error,
    refetch,
  } = useFollowUp({
    patientId: patientId ?? undefined,
    enabled: !!patientId,
  });

  if (authLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <Text style={styles.centeredText}>Loading patient…</Text>
      </View>
    );
  }

  if (!isAuthenticated || userType !== 'periodontist' || !periodontist) {
    return <Redirect href={{ pathname: '/(auth)/login' }} />;
  }

  if (!patientId) {
    router.replace({ pathname: '/(periodontist)/dashboard' } as any);
    return null;
  }

  const handleSaveDiagnosis = async (values: {
    type: Diagnosis['type'];
    grade: number | null;
    stage: number | null;
    notes: string;
  }) => {
    await createOrUpdateDiagnosis({
      patientId,
      periodontistId: periodontist.id,
      type: values.type,
      grade: values.grade,
      stage: values.stage,
      notes: values.notes,
    });
    await refetch();
  };

  const handleAddRiskFactor = async (values: { type: string; details: Record<string, unknown> }) => {
    await addRiskFactor({
      patientId,
      periodontistId: periodontist.id,
      type: values.type as any,
      details: values.details,
    });
    await refetch();
  };

  const handleRemoveRiskFactor = async (riskFactorId: string) => {
    await removeRiskFactor({
      riskFactorId,
      periodontistId: periodontist.id,
      patientId,
    });
    await refetch();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Patient Details</Text>
        {patient ? (
          <>
            <Text style={styles.subtitle}>{patient.email}</Text>
            <Text style={styles.subtitle}>Status: {patient.accountStatus}</Text>
          </>
        ) : (
          <Text style={styles.subtitle}>Patient information unavailable.</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionHeading}>Current Diagnosis</Text>
        <DiagnosisDisplay
          diagnosis={diagnosis}
          isLoading={followUpLoading}
          error={error?.message ?? null}
        />
      </View>

      <DiagnosisForm
        initialValues={{
          type: diagnosis?.type ?? 'gingivitis',
          grade: diagnosis?.grade ?? null,
          stage: diagnosis?.stage ?? null,
          notes: '',
        }}
        loading={isFetching}
        onSubmit={handleSaveDiagnosis}
      />

      <View style={styles.card}>
        <Text style={styles.sectionHeading}>Current Risk Factors</Text>
        <RiskFactorsDisplay
          riskFactors={riskFactors}
          isLoading={followUpLoading}
          error={error?.message ?? null}
        />
      </View>

      <RiskFactorForm
        existingRiskFactors={riskFactors}
        loading={isFetching}
        onSubmit={handleAddRiskFactor}
        onRemove={handleRemoveRiskFactor}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  header: {
    gap: Spacing.xs,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  card: {
    padding: Spacing.md,
    backgroundColor: Colors.light.surface,
    borderRadius: Spacing.md,
    borderColor: Colors.light.border,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    gap: Spacing.md,
  },
  centeredText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
});

