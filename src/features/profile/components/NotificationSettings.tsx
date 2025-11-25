import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Colors, Spacing } from '@/constants/theme';
import type { NotificationSettings } from '../service/types';

export interface NotificationSettingsProps {
  initialSettings?: NotificationSettings | null;
  loading?: boolean;
  error?: string | null;
  onLoadSettings: () => Promise<NotificationSettings | null>;
  onSave: (settings: NotificationSettings) => void | Promise<void>;
}

export function NotificationSettingsComponent({
  initialSettings,
  loading = false,
  error = null,
  onLoadSettings,
  onSave,
}: NotificationSettingsProps) {
  const [settings, setSettings] = useState<NotificationSettings>(
    initialSettings || {
      emailNotifications: true,
      pushNotifications: true,
      checkInReminders: true,
      articleUpdates: false,
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
          console.error('Failed to load notification settings:', err);
        } finally {
          setIsLoadingSettings(false);
        }
      }
    };

    loadSettings();
  }, [initialSettings, onLoadSettings]);

  const handleToggle = (key: keyof NotificationSettings) => {
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
      <Text style={styles.title}>Notification Settings</Text>

      <View style={styles.settingRow}>
        <View style={styles.settingContent}>
          <Text style={styles.settingLabel}>Email Notifications</Text>
          <Text style={styles.settingDescription}>
            Receive notifications via email
          </Text>
        </View>
        <Switch
          value={settings.emailNotifications}
          onValueChange={() => handleToggle('emailNotifications')}
          trackColor={{ false: Colors.light.border, true: Colors.light.primary }}
        />
      </View>

      <View style={styles.settingRow}>
        <View style={styles.settingContent}>
          <Text style={styles.settingLabel}>Push Notifications</Text>
          <Text style={styles.settingDescription}>
            Receive push notifications on your device
          </Text>
        </View>
        <Switch
          value={settings.pushNotifications}
          onValueChange={() => handleToggle('pushNotifications')}
          trackColor={{ false: Colors.light.border, true: Colors.light.primary }}
        />
      </View>

      <View style={styles.settingRow}>
        <View style={styles.settingContent}>
          <Text style={styles.settingLabel}>Check-in Reminders</Text>
          <Text style={styles.settingDescription}>
            Remind me to complete daily check-ins
          </Text>
        </View>
        <Switch
          value={settings.checkInReminders}
          onValueChange={() => handleToggle('checkInReminders')}
          trackColor={{ false: Colors.light.border, true: Colors.light.primary }}
        />
      </View>

      <View style={styles.settingRow}>
        <View style={styles.settingContent}>
          <Text style={styles.settingLabel}>Article Updates</Text>
          <Text style={styles.settingDescription}>
            Notify me about new articles
          </Text>
        </View>
        <Switch
          value={settings.articleUpdates}
          onValueChange={() => handleToggle('articleUpdates')}
          trackColor={{ false: Colors.light.border, true: Colors.light.primary }}
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



