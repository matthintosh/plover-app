import React, { useEffect, useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Colors, Spacing } from '@/constants/theme';
import type { PrivacySettings } from '../service/types';

export interface PrivacySettingsProps {
  initialSettings?: PrivacySettings | null;
  loading?: boolean;
  error?: string | null;
  onLoadSettings: () => Promise<PrivacySettings | null>;
  onSave: (settings: PrivacySettings) => void | Promise<void>;
}

export function PrivacySettingsComponent({
  initialSettings,
  loading = false,
  error = null,
  onLoadSettings,
  onSave,
}: PrivacySettingsProps) {
  const [settings, setSettings] = useState<PrivacySettings>(
    initialSettings || {
      dataSharing: true,
      analytics: true,
    },
  );
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      if (!initialSettings) {
        setIsLoadingSettings(true);
        try {
          const loaded = await onLoadSettings();
          if (loaded) {
            setSettings(loaded);
          }
        } catch (err) {
          console.error('Failed to load privacy settings:', err);
        } finally {
          setIsLoadingSettings(false);
        }
      }
    };

    loadSettings();
  }, [initialSettings, onLoadSettings]);

  const handleToggle = (key: keyof PrivacySettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    onSave(settings);
  };

  if (isLoadingSettings) {
    return (
      <Card style={styles.card}>
        <Text style={styles.loadingText}>Loading settings...</Text>
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Privacy & Confidentiality</Text>

      <View style={styles.settingRow}>
        <View style={styles.settingContent}>
          <Text style={styles.settingLabel}>Data Sharing</Text>
          <Text style={styles.settingDescription}>
            Allow sharing of anonymized data for research and improvement purposes
          </Text>
        </View>
        <Switch
          value={settings.dataSharing}
          onValueChange={() => handleToggle('dataSharing')}
          trackColor={{ false: Colors.light.border, true: Colors.light.primary }}
        />
      </View>

      <View style={styles.settingRow}>
        <View style={styles.settingContent}>
          <Text style={styles.settingLabel}>Analytics</Text>
          <Text style={styles.settingDescription}>
            Allow collection of usage analytics to improve the app experience
          </Text>
        </View>
        <Switch
          value={settings.analytics}
          onValueChange={() => handleToggle('analytics')}
          trackColor={{ false: Colors.light.border, true: Colors.light.primary}}
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Button
        title={loading ? 'Saving...' : 'Save Settings'}
        onPress={handleSave}
        variant="primary"
        fullWidth
        disabled={loading}
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
    marginBottom: Spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  settingContent: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  settingDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  submitButton: {
    marginTop: Spacing.md,
  },
  errorText: {
    fontSize: 12,
    color: Colors.light.error,
    marginTop: Spacing.sm,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    padding: Spacing.md,
  },
});





