import { Colors, Spacing } from '@/constants/theme';
import type { PatientProfile } from '@/features/authentication/repository/patient.repository.interface';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export interface PatientListProps {
  patients: PatientProfile[];
  selectedPatientId: string | null;
  onSelectPatient: (patientId: string) => void;
}

export const PatientList: React.FC<PatientListProps> = ({
  patients,
  selectedPatientId,
  onSelectPatient,
}) => {
  if (!patients.length) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>No patients yet</Text>
        <Text style={styles.emptySubtitle}>
          Invite a patient to get started with diagnosis and risk factor tracking.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      {patients.map((patient) => {
        const selected = patient.id === selectedPatientId;

        return (
          <Pressable
            key={patient.id}
            style={[styles.patientItem, selected && styles.patientItemSelected]}
            onPress={() => onSelectPatient(patient.id)}>
            <View style={styles.patientCopy}>
              <Text style={[styles.patientName, selected && styles.patientNameSelected]}>
                {patient.email}
              </Text>
              <Text style={styles.patientMeta}>
                Status: {patient.accountStatus.replace('_', ' ')}
              </Text>
            </View>
            <Text style={[styles.viewDetails, selected && styles.viewDetailsSelected]}>
              View details
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    gap: Spacing.sm,
  },
  patientItem: {
    padding: Spacing.md,
    borderRadius: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  patientItemSelected: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  patientCopy: {
    flex: 1,
    gap: 4,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  patientNameSelected: {
    color: Colors.light.primary,
  },
  patientMeta: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  viewDetails: {
    fontSize: 12,
    color: Colors.light.primary,
    fontWeight: '600',
  },
  viewDetailsSelected: {
    textDecorationLine: 'underline',
  },
  emptyState: {
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: Spacing.md,
    backgroundColor: Colors.light.surface,
    gap: Spacing.sm,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
});

