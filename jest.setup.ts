import React from 'react';
import '@testing-library/jest-native/extend-expect';
import 'react-native-gesture-handler/jestSetup';

process.env.EXPO_OS = 'web';

jest.mock('expo-router', () => {
  return {
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
    }),
    useLocalSearchParams: () => ({}),
    Stack: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('expo-linking', () => ({
  makeUrl: jest.fn(),
}));
