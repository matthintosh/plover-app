import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Button } from '@/components/ui/Button';
import { Colors, Spacing } from '@/constants/theme';
import { type InterdentalSpace } from '../schema/fdi-dental-numbering';
import type { OdontogramSpace } from '../service/types';
import { OdontogramDisplay } from './OdontogramDisplay';

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
  const [selectedSpaceForEdit, setSelectedSpaceForEdit] = useState<InterdentalSpace | null>(null);
  const [showToolModal, setShowToolModal] = useState(false);
  const [showBrushSizeModal, setShowBrushSizeModal] = useState(false);
  const [tempBrushSize, setTempBrushSize] = useState('');

  const handleSpaceClick = (space: InterdentalSpace) => {
    const existing = selectedSpaces.get(space.spaceId);
    
    if (existing) {
      // If space already has a recommendation, allow editing
      if (existing.toolType === 'interdental_brush') {
        setTempBrushSize(existing.brushSize || '');
        setShowBrushSizeModal(true);
      } else {
        // For floss, show tool selection to change or remove
        setSelectedSpaceForEdit(space);
        setShowToolModal(true);
      }
    } else {
      // New space - show tool selection
      setSelectedSpaceForEdit(space);
      setShowToolModal(true);
    }
  };

  const handleToolSelect = (toolType: 'interdental_brush' | 'floss') => {
    if (!selectedSpaceForEdit) return;

    const newSpaces = new Map(selectedSpaces);
    
    if (toolType === 'interdental_brush') {
      // For brush, show brush size input
      setTempBrushSize('0.5mm');
      setShowToolModal(false);
      setShowBrushSizeModal(true);
    } else {
      // For floss, add directly
      newSpaces.set(selectedSpaceForEdit.spaceId, {
        spaceId: selectedSpaceForEdit.spaceId,
        toolType: 'floss',
      });
      setSelectedSpaces(newSpaces);
      setShowToolModal(false);
      setSelectedSpaceForEdit(null);
      setFormErrors({});
    }
  };

  const handleBrushSizeConfirm = () => {
    if (!selectedSpaceForEdit) return;

    const newSpaces = new Map(selectedSpaces);
    newSpaces.set(selectedSpaceForEdit.spaceId, {
      spaceId: selectedSpaceForEdit.spaceId,
      toolType: 'interdental_brush',
      brushSize: tempBrushSize.trim() || undefined,
    });
    setSelectedSpaces(newSpaces);
    setShowBrushSizeModal(false);
    setSelectedSpaceForEdit(null);
    setTempBrushSize('');
    setFormErrors({});
  };

  const handleRemoveSpace = () => {
    if (!selectedSpaceForEdit) return;

    const newSpaces = new Map(selectedSpaces);
    newSpaces.delete(selectedSpaceForEdit.spaceId);
    setSelectedSpaces(newSpaces);
    setShowToolModal(false);
    setSelectedSpaceForEdit(null);
    setFormErrors({});
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

  // Create odontogram object for display
  const currentOdontogram = {
    id: 'temp',
    spaces: Array.from(selectedSpaces.values()),
  };

  return (
    <>
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
          <OdontogramDisplay
            odontogram={currentOdontogram}
            editable={true}
            onSpaceClick={handleSpaceClick}
          />

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

      {/* Tool Selection Modal */}
      <Modal
        visible={showToolModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowToolModal(false);
          setSelectedSpaceForEdit(null);
        }}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: Colors.light.surface }]}>
            <Text style={[styles.modalTitle, { color: Colors.light.text }]}>
              Select Tool for Space {selectedSpaceForEdit?.spaceId}
            </Text>
            <Text style={[styles.modalSubtitle, { color: Colors.light.textSecondary }]}>
              Between teeth {selectedSpaceForEdit?.tooth1} and {selectedSpaceForEdit?.tooth2}
            </Text>
            <View style={styles.modalButtons}>
              <Button
                title="Interdental Brush"
                onPress={() => handleToolSelect('interdental_brush')}
                variant="primary"
                style={styles.modalButton}
              />
              <Button
                title="Floss"
                onPress={() => handleToolSelect('floss')}
                variant="secondary"
                style={styles.modalButton}
              />
              {selectedSpaces.has(selectedSpaceForEdit?.spaceId || '') && (
                <Button
                  title="Remove"
                  onPress={handleRemoveSpace}
                  variant="danger"
                  style={styles.modalButton}
                />
              )}
              <Button
                title="Cancel"
                onPress={() => {
                  setShowToolModal(false);
                  setSelectedSpaceForEdit(null);
                }}
                variant="outline"
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Brush Size Input Modal */}
      <Modal
        visible={showBrushSizeModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowBrushSizeModal(false);
          setSelectedSpaceForEdit(null);
          setTempBrushSize('');
        }}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: Colors.light.surface }]}>
            <Text style={[styles.modalTitle, { color: Colors.light.text }]}>
              Brush Size for Space {selectedSpaceForEdit?.spaceId}
            </Text>
            <TextInput
              style={[styles.modalInput, { color: Colors.light.text, borderColor: Colors.light.border }]}
              value={tempBrushSize}
              onChangeText={setTempBrushSize}
              placeholder="e.g., 0.5mm, 0.7mm, 1.0mm"
              placeholderTextColor={Colors.light.textSecondary}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <Button
                title="Confirm"
                onPress={handleBrushSizeConfirm}
                variant="primary"
                style={styles.modalButton}
                disabled={!tempBrushSize.trim()}
              />
              <Button
                title="Cancel"
                onPress={() => {
                  setShowBrushSizeModal(false);
                  setSelectedSpaceForEdit(null);
                  setTempBrushSize('');
                }}
                variant="outline"
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: Spacing.md,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.light.text,
  },
  modalSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: Colors.light.textSecondary,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: Spacing.sm,
    padding: Spacing.md,
    fontSize: 16,
    backgroundColor: Colors.light.background,
  },
  modalButtons: {
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  modalButton: {
    width: '100%',
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





