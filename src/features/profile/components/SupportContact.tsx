import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Colors, Spacing } from '@/constants/theme';
import type { SupportContactInput } from '../service/types';

export interface SupportContactProps {
  onSubmit: (input: SupportContactInput) => void | Promise<void>;
  loading?: boolean;
  error?: string | null;
}

const CATEGORIES: Array<{ label: string; value: SupportContactInput['category'] }> = [
  { label: 'Technical', value: 'technical' },
  { label: 'Account', value: 'account' },
  { label: 'Medical', value: 'medical' },
  { label: 'Other', value: 'other' },
];

export function SupportContact({
  onSubmit,
  loading = false,
  error = null,
}: SupportContactProps) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<SupportContactInput['category']>('other');

  const handleSubmit = () => {
    if (!subject.trim() || !message.trim()) {
      return;
    }

    onSubmit({
      subject: subject.trim(),
      message: message.trim(),
      category,
    });

    // Reset form after submission
    setSubject('');
    setMessage('');
    setCategory('other');
  };

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Contact Support</Text>
      <Text style={styles.description}>
        Have a question or need help? Send us a message and we'll get back to you as soon as
        possible.
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryContainer}>
          {CATEGORIES.map((cat) => (
            <Button
              key={cat.value}
              title={cat.label}
              onPress={() => setCategory(cat.value)}
              variant={category === cat.value ? 'primary' : 'secondary'}
              style={styles.categoryButton}
            />
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Subject</Text>
        <TextInput
          style={styles.input}
          value={subject}
          onChangeText={setSubject}
          placeholder="Brief description of your issue"
          placeholderTextColor={Colors.light.textSecondary}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Message</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={message}
          onChangeText={setMessage}
          placeholder="Please provide details about your question or issue"
          placeholderTextColor={Colors.light.textSecondary}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Button
        title={loading ? 'Sending...' : 'Send Message'}
        onPress={handleSubmit}
        variant="primary"
        fullWidth
        disabled={loading || !subject.trim() || !message.trim()}
        style={styles.submitButton}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryButton: {
    flex: 1,
    minWidth: 80,
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
  textArea: {
    minHeight: 120,
    paddingTop: Spacing.md,
  },
  submitButton: {
    marginTop: Spacing.md,
  },
  errorText: {
    fontSize: 12,
    color: Colors.light.error,
    marginBottom: Spacing.sm,
  },
});





