import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Colors, Spacing } from '@/constants/theme';
import type { Diagnosis } from '@/features/follow-up/service/types';
import type { DiagnosisFormValues } from '../service/types';

export interface DiagnosisFormProps {
  initialValues: DiagnosisFormValues;
  loading?: boolean;
  error?: string | null;
  onSubmit: (values: {
    type: Diagnosis['type'];
    grade: number | null;
    stage: number | null;
    notes: string;
  }) => void | Promise<void>;
}

type FormErrors = {
  grade?: string;
  stage?: string;
};

const DIAGNOSIS_TYPES: Diagnosis['type'][] = ['gingivitis', 'periodontitis'];

export const DiagnosisForm: React.FC<DiagnosisFormProps> = ({
  initialValues,
  loading = false,
  error = null,
  onSubmit,
}) => {
  const [type, setType] = useState<Diagnosis['type']>(initialValues.type);
  const [gradeInput, setGradeInput] = useState(
    initialValues.grade != null ? String(initialValues.grade) : '',
  );
  const [stageInput, setStageInput] = useState(
    initialValues.stage != null ? String(initialValues.stage) : '',
  );
  const [notes, setNotes] = useState(initialValues.notes ?? '');
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const handleSelectType = (nextType: Diagnosis['type']) => {
    setType(nextType);
    setFormErrors({});

    if (nextType === 'gingivitis') {
      setGradeInput('');
      setStageInput('');
    }
  };

  const derivedGrade = useMemo(() => {
    if (!gradeInput.trim()) {
      return null;
    }
    const value = Number(gradeInput);
    return Number.isNaN(value) ? null : value;
  }, [gradeInput]);

  const derivedStage = useMemo(() => {
    if (!stageInput.trim()) {
      return null;
    }
    const value = Number(stageInput);
    return Number.isNaN(value) ? null : value;
  }, [stageInput]);

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (type === 'periodontitis') {
      if (derivedGrade == null) {
        nextErrors.grade = 'Grade is required for periodontitis';
      } else if (derivedGrade < 1 || derivedGrade > 4) {
        nextErrors.grade = 'Grade must be between 1 and 4';
      }

      if (derivedStage == null) {
        nextErrors.stage = 'Stage is required for periodontitis';
      } else if (derivedStage < 1 || derivedStage > 4) {
        nextErrors.stage = 'Stage must be between 1 and 4';
      }
    }

    setFormErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    onSubmit({
      type,
      grade: type === 'periodontitis' ? derivedGrade : null,
      stage: type === 'periodontitis' ? derivedStage : null,
      notes: notes.trim(),
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>Diagnosis</Text>
      <View style={styles.typeRow}>
        {DIAGNOSIS_TYPES.map((diagnosisType) => {
          const selected = diagnosisType === type;

          return (
            <Pressable
              key={diagnosisType}
              accessibilityRole="button"
              onPress={() => handleSelectType(diagnosisType)}
              style={[styles.typeChip, selected && styles.typeChipSelected]}>
              <Text style={[styles.typeChipText, selected && styles.typeChipTextSelected]}>
                {diagnosisType.charAt(0).toUpperCase() + diagnosisType.slice(1)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {type === 'periodontitis' ? (
        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <TextInput
              placeholder="Grade (1-4)"
              keyboardType="number-pad"
              value={gradeInput}
              onChangeText={setGradeInput}
              style={styles.input}
            />
            {formErrors.grade ? <Text style={styles.errorText}>{formErrors.grade}</Text> : null}
          </View>
          <View style={styles.inputGroup}>
            <TextInput
              placeholder="Stage (1-4)"
              keyboardType="number-pad"
              value={stageInput}
              onChangeText={setStageInput}
              style={styles.input}
            />
            {formErrors.stage ? <Text style={styles.errorText}>{formErrors.stage}</Text> : null}
          </View>
        </View>
      ) : null}

      <TextInput
        placeholder="Notes (optional)"
        value={notes}
        onChangeText={setNotes}
        style={[styles.input, styles.notesInput]}
        multiline
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Button
        title={loading ? 'Saving…' : 'Save Diagnosis'}
        onPress={handleSubmit}
        loading={loading}
        fullWidth
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
    backgroundColor: Colors.light.surface,
    borderRadius: Spacing.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  typeRow: {
    flexDirection: 'row',
    columnGap: Spacing.sm,
  },
  typeChip: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Spacing.full,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  typeChipSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  typeChipText: {
    color: Colors.light.textSecondary,
    fontSize: 14,
    textTransform: 'capitalize',
  },
  typeChipTextSelected: {
    color: Colors.light.background,
  },
  row: {
    flexDirection: 'row',
    columnGap: Spacing.md,
  },
  inputGroup: {
    flex: 1,
    gap: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 16,
    backgroundColor: Colors.light.surface,
    color: Colors.light.text,
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    color: Colors.light.error,
    fontSize: 12,
  },
});

