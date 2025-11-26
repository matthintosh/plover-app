import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Colors, Spacing } from '@/constants/theme';

export interface AccountDeletionProps {
  onDelete: () => void | Promise<void>;
  loading?: boolean;
}

export function AccountDeletion({ onDelete, loading = false }: AccountDeletionProps) {
  const [confirmationText, setConfirmationText] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const requiredText = 'DELETE';

  const handleDeletePress = () => {
    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    if (confirmationText !== requiredText) {
      Alert.alert('Invalid Confirmation', `Please type "${requiredText}" to confirm deletion.`);
      return;
    }

    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            setShowConfirmation(false);
            setConfirmationText('');
          },
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await onDelete();
          },
        },
      ],
    );
  };

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Delete Account</Text>
      <Text style={styles.warningText}>
        Warning: Deleting your account will permanently remove all your data, including check-ins,
        statistics, and profile information. This action cannot be undone.
      </Text>

      {showConfirmation && (
        <View style={styles.confirmationSection}>
          <Text style={styles.confirmationLabel}>
            Type "{requiredText}" to confirm account deletion:
          </Text>
          <TextInput
            style={styles.confirmationInput}
            value={confirmationText}
            onChangeText={setConfirmationText}
            placeholder={requiredText}
            placeholderTextColor={Colors.light.textSecondary}
            autoCapitalize="characters"
          />
        </View>
      )}

      <Button
        title={showConfirmation ? 'Confirm Deletion' : 'Delete Account'}
        onPress={handleDeletePress}
        variant="secondary"
        fullWidth
        disabled={loading || (showConfirmation && confirmationText !== requiredText)}
        style={[
          styles.deleteButton,
          showConfirmation && confirmationText === requiredText && styles.deleteButtonActive,
        ]}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.lg,
    borderColor: Colors.light.error,
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.error,
    marginBottom: Spacing.md,
  },
  warningText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  confirmationSection: {
    marginBottom: Spacing.md,
  },
  confirmationLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: Spacing.sm,
  },
  confirmationInput: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: Spacing.sm,
    padding: Spacing.md,
    fontSize: 16,
    color: Colors.light.text,
    backgroundColor: Colors.light.background,
  },
  deleteButton: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.light.error + '20',
  },
  deleteButtonActive: {
    backgroundColor: Colors.light.error,
  },
});





