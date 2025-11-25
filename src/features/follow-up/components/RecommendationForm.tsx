import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Colors, Spacing } from '@/constants/theme';
import type { OdontogramSpace } from '../service/types';

export interface RecommendationFormProps {
  initialValues?: {
    toothbrushType?: string;
    toothbrushBrand?: string;
    toothbrushModel?: string;
    odontogram?: {
      spaces: OdontogramSpace[];
    };
  };
  loading?: boolean;
  error?: string | null;
  onSubmit: (values: {
    toothbrushType?: string;
    toothbrushBrand?: string;
    toothbrushModel?: string;
    odontogram?: {
      spaces: OdontogramSpace[];
    };
  }) => void | Promise<void>;
}

type FormErrors = {
  toothbrushType?: string;
  odontogram?: string;
};

export const RecommendationForm: React.FC<RecommendationFormProps> = ({
  initialValues,
  loading = false,
  error = null,
  onSubmit,
}) => {
  const [toothbrushType, setToothbrushType] = useState(
    initialValues?.toothbrushType || '',
  );
  const [toothbrushBrand, setToothbrushBrand] = useState(
    initialValues?.toothbrushBrand || '',
  );
  const [toothbrushModel, setToothbrushModel] = useState(
    initialValues?.toothbrushModel || '',
  );
  const [selectedSpaces, setSelectedSpaces] = useState<Map<string, OdontogramSpace>>(
    new Map(
      initialValues?.odontogram?.spaces.map((space) => [space.spaceId, space]) || [],
    ),
  );
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const handleSpaceToggle = (spaceId: string, toolType: 'interdental_brush' | 'floss') => {
    const newSpaces = new Map(selectedSpaces);
    const existing = newSpaces.get(spaceId);

    if (existing && existing.toolType === toolType) {
      // Remove if clicking the same tool type
      newSpaces.delete(spaceId);
    } else {
      // Add or update
      newSpaces.set(spaceId, {
        spaceId,
        toolType,
        brushSize: toolType === 'interdental_brush' ? '0.5mm' : undefined,
      });
    }

    setSelectedSpaces(newSpaces);
    setFormErrors({});
  };

  const handleBrushSizeChange = (spaceId: string, brushSize: string) => {
    const newSpaces = new Map(selectedSpaces);
    const existing = newSpaces.get(spaceId);

    if (existing && existing.toolType === 'interdental_brush') {
      newSpaces.set(spaceId, {
        ...existing,
        brushSize: brushSize || undefined,
      });
      setSelectedSpaces(newSpaces);
    }
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    // At least one field must be provided
    const hasToothbrushData =
      toothbrushType.trim() || toothbrushBrand.trim() || toothbrushModel.trim();
    const hasOdontogramData = selectedSpaces.size > 0;

    if (!hasToothbrushData && !hasOdontogramData) {
      nextErrors.toothbrushType =
        'Please provide at least toothbrush information or odontogram data';
    }

    // Validate odontogram spaces
    for (const space of selectedSpaces.values()) {
      if (
        space.toolType === 'interdental_brush' &&
        (!space.brushSize || space.brushSize.trim() === '')
      ) {
        nextErrors.odontogram = `Brush size is required for space ${space.spaceId}`;
        break;
      }
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    const odontogramData =
      selectedSpaces.size > 0
        ? {
            spaces: Array.from(selectedSpaces.values()),
          }
        : undefined;

    onSubmit({
      toothbrushType: toothbrushType.trim() || undefined,
      toothbrushBrand: toothbrushBrand.trim() || undefined,
      toothbrushModel: toothbrushModel.trim() || undefined,
      odontogram: odontogramData,
    });
  };

  // Generate space IDs (1-2 through 31-32)
  const spaceIds: string[] = [];
  for (let i = 1; i <= 31; i++) {
    spaceIds.push(`${i}-${i + 1}`);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Toothbrush Information</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Type</Text>
          <TextInput
            style={styles.input}
            value={toothbrushType}
            onChangeText={setToothbrushType}
            placeholder="e.g., soft, medium, hard"
            placeholderTextColor={Colors.light.textSecondary}
          />
          {formErrors.toothbrushType && (
            <Text style={styles.errorText}>{formErrors.toothbrushType}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Brand</Text>
          <TextInput
            style={styles.input}
            value={toothbrushBrand}
            onChangeText={setToothbrushBrand}
            placeholder="e.g., Brand Name"
            placeholderTextColor={Colors.light.textSecondary}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Model</Text>
          <TextInput
            style={styles.input}
            value={toothbrushModel}
            onChangeText={setToothbrushModel}
            placeholder="e.g., Model Name"
            placeholderTextColor={Colors.light.textSecondary}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Odontogram</Text>
        <Text style={styles.sectionDescription}>
          Select recommended tools for each interdental space
        </Text>

        <View style={styles.odontogramGrid}>
          {spaceIds.map((spaceId) => {
            const space = selectedSpaces.get(spaceId);
            const isBrush = space?.toolType === 'interdental_brush';
            const isFloss = space?.toolType === 'floss';

            return (
              <View key={spaceId} style={styles.spaceContainer}>
                <Text style={styles.spaceLabel}>{spaceId}</Text>
                <View style={styles.spaceButtons}>
                  <Button
                    title="Brush"
                    onPress={() => handleSpaceToggle(spaceId, 'interdental_brush')}
                    variant={isBrush ? 'primary' : 'secondary'}
                    style={styles.spaceButton}
                  />
                  <Button
                    title="Floss"
                    onPress={() => handleSpaceToggle(spaceId, 'floss')}
                    variant={isFloss ? 'primary' : 'secondary'}
                    style={styles.spaceButton}
                  />
                </View>
                {isBrush && (
                  <TextInput
                    style={styles.brushSizeInput}
                    value={space?.brushSize || ''}
                    onChangeText={(value) => handleBrushSizeChange(spaceId, value)}
                    placeholder="Size (e.g., 0.5mm)"
                    placeholderTextColor={Colors.light.textSecondary}
                  />
                )}
              </View>
            );
          })}
        </View>

        {formErrors.odontogram && (
          <Text style={styles.errorText}>{formErrors.odontogram}</Text>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Button
        title={loading ? 'Saving...' : 'Save Recommendations'}
        onPress={handleSubmit}
        variant="primary"
        fullWidth
        disabled={loading}
        style={styles.submitButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  section: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.sm,
  },
  inputGroup: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: Spacing.sm,
    padding: Spacing.md,
    fontSize: 16,
    color: Colors.light.text,
    backgroundColor: Colors.light.background,
  },
  odontogramGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  spaceContainer: {
    width: '30%',
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: Spacing.sm,
    backgroundColor: Colors.light.surface,
    gap: Spacing.xs,
  },
  spaceLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.text,
    textAlign: 'center',
  },
  spaceButtons: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  spaceButton: {
    flex: 1,
    paddingVertical: Spacing.xs,
  },
  brushSizeInput: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: Spacing.xs,
    padding: Spacing.xs,
    fontSize: 12,
    color: Colors.light.text,
    backgroundColor: Colors.light.background,
  },
  submitButton: {
    marginTop: Spacing.md,
  },
  errorText: {
    fontSize: 12,
    color: Colors.light.error,
    marginTop: Spacing.xs,
  },
});



