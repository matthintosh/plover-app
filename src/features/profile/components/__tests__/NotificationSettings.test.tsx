import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { NotificationSettingsComponent } from '../NotificationSettings';

const renderNotificationSettings = (overrideProps: Partial<any> = {}) => {
  const props = {
    initialSettings: {
      emailNotifications: true,
      pushNotifications: true,
      checkInReminders: true,
      articleUpdates: false,
    },
    loading: false,
    error: null,
    onLoadSettings: jest.fn().mockResolvedValue({
      emailNotifications: true,
      pushNotifications: true,
      checkInReminders: true,
      articleUpdates: false,
    }),
    onSave: jest.fn(),
    ...overrideProps,
  };

  const utils = render(<NotificationSettingsComponent {...props} />);

  return {
    ...utils,
    props,
  };
};

describe('NotificationSettings', () => {
  it('renders notification settings', () => {
    const { getByText, getAllByText } = renderNotificationSettings({
      initialSettings: {
        emailNotifications: true,
        pushNotifications: true,
        checkInReminders: true,
        articleUpdates: false,
      },
    });

    expect(getByText(/notification settings/i)).toBeTruthy();
    expect(getByText(/email notifications/i)).toBeTruthy();
    // Multiple elements contain "push notifications" (label and description)
    expect(getAllByText(/push notifications/i).length).toBeGreaterThan(0);
    expect(getByText(/check-in reminders/i)).toBeTruthy();
    expect(getByText(/Article Updates/i)).toBeTruthy();
  });

  it('toggles settings', () => {
    const onSave = jest.fn();
    const { getByText, getAllByRole } = renderNotificationSettings({ onSave });

    const switches = getAllByRole('switch');
    expect(switches.length).toBeGreaterThan(0);

    // Toggle first switch
    fireEvent(switches[0], 'valueChange', false);

    const saveButton = getByText(/save settings/i);
    fireEvent.press(saveButton);

    expect(onSave).toHaveBeenCalled();
  });

  it('saves settings with updated values', () => {
    const onSave = jest.fn();
    const { getByText, getAllByRole } = renderNotificationSettings({ onSave });

    const switches = getAllByRole('switch');
    fireEvent(switches[0], 'valueChange', false);

    const saveButton = getByText(/save settings/i);
    fireEvent.press(saveButton);

    expect(onSave).toHaveBeenCalled();
    const callArgs = onSave.mock.calls[0][0];
    expect(callArgs).toHaveProperty('emailNotifications');
  });
});

