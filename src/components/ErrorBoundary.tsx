import React, { Component, ErrorInfo, ReactNode } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Button } from './ui/Button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (__DEV__) {
      console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    }

    // Call optional error handler
    this.props.onError?.(error, errorInfo);

    // In production, you might want to send this to an error reporting service
    // e.g., Sentry, LogRocket, etc.
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  onReset: () => void;
}

function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: palette.text }]}>Something went wrong</Text>
        <Text style={[styles.message, { color: palette.textSecondary }]}>
          We're sorry, but something unexpected happened. Please try again.
        </Text>
        {__DEV__ && error && (
          <View style={[styles.errorContainer, { backgroundColor: palette.surface }]}>
            <Text style={[styles.errorText, { color: palette.error }]}>
              {error.message || 'Unknown error'}
            </Text>
            {error.stack && (
              <Text style={[styles.stackTrace, { color: palette.textSecondary }]}>
                {error.stack}
              </Text>
            )}
          </View>
        )}
        <Button
          title="Try Again"
          onPress={onReset}
          variant="primary"
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.light.background,
  },
  content: {
    maxWidth: 400,
    width: '100%',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: Colors.light.text,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    color: Colors.light.textSecondary,
  },
  errorContainer: {
    width: '100%',
    padding: Spacing.md,
    borderRadius: Spacing.sm,
    backgroundColor: Colors.light.surface,
    marginTop: Spacing.md,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.error,
    marginBottom: Spacing.xs,
  },
  stackTrace: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: Colors.light.textSecondary,
  },
  button: {
    marginTop: Spacing.md,
  },
});
