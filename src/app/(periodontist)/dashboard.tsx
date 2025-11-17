import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { PatientInvitationForm } from '@/features/authentication/components/PatientInvitationForm';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { AuthService } from '@/features/authentication/service/auth.service';
import { PatientList } from '@/features/periodontist-dashboard/components/PatientList';
import { usePeriodontistDashboard } from '@/features/periodontist-dashboard/hooks/usePeriodontistDashboard';
import { useThemeColor } from '@/hooks/use-theme-color';
import { normalizeError } from '@/lib/utils/error-handling';

export default function PeriodontistDashboard() {
  const auth = useAuth();
  const router = useRouter();
  const authService = useMemo(() => new AuthService(), []);
  const [invitationLoading, setInvitationLoading] = useState(false);
  const [invitationError, setInvitationError] = useState<string | null>(null);
  const [invitationSuccess, setInvitationSuccess] = useState<string | null>(null);
  const {
    patients,
    isLoadingPatients,
    refetchPatients
  } = usePeriodontistDashboard({ periodontistId: auth.periodontist?.id });
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const successColor = useThemeColor({}, 'success');
  const backgroundColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');

  const handleInvite = useCallback(
    async ({ email }: { email: string }) => {
      if (!auth.periodontist) {
        setInvitationError('You must be signed in as a periodontist to invite patients.');
        return;
      }

      setInvitationLoading(true);
      setInvitationError(null);
      setInvitationSuccess(null);

      try {
        await authService.sendPatientInvitation({
          periodontistId: auth.periodontist.id,
          email,
        });

        setInvitationSuccess(`Invitation sent to ${email}.`);
      } catch (err) {
        const normalized = normalizeError(err);
        setInvitationError(normalized.message);
      } finally {
        setInvitationLoading(false);
        refetchPatients();
      }
    },
    [auth, authService, refetchPatients],
  );

  const handleSelectPatient = useCallback(
    (patientId: string) => {
      router.push({ pathname: '/(periodontist)/patient/[id]', params: { id: patientId } } as any);
    },
    [router],
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Periodontist Dashboard</Text>
        {auth.periodontist ? (
          <Text style={[styles.subtitle, { color: textSecondaryColor }]}>Welcome, {auth.periodontist.fullName}</Text>
        ) : (
          <Text style={[styles.subtitle, { color: textSecondaryColor }]}>You are not signed in.</Text>
        )}
      </View>

      <View style={[styles.card, { backgroundColor }]}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Invite a patient</Text>
        <Text style={[styles.sectionDescription, { color: textSecondaryColor }]}>
          Send a magic link invitation to onboard a new patient into your care program.
        </Text>

        <PatientInvitationForm
          onSubmit={handleInvite}
          loading={invitationLoading}
          error={invitationError}
        />

        {invitationSuccess ? <Text style={[styles.successText, { color: successColor }]}>{invitationSuccess}</Text> : null}
      </View>

      <View style={[styles.card, { backgroundColor }]}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Your Patients</Text>
        <Text style={[styles.sectionDescription, { color: textSecondaryColor }]}>
          Select a patient to view or update their diagnosis and risk factors.
        </Text>

        {isLoadingPatients ? (
          <Text>Loading patients…</Text>
        ) : (
          <PatientList
            patients={patients}
            selectedPatientId={null}
            onSelectPatient={handleSelectPatient}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  header: {
    gap: Spacing.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
  },
  card: {
    padding: Spacing.lg,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  sectionDescription: {
    fontSize: 14,
  },
  successText: {
    fontSize: 14,
  },
});
