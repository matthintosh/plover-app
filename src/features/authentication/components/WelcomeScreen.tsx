import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { LinearBackground } from '@/components/ui/LinearBackground';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';


export function WelcomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  const handleCreateAccount = () => {
    router.push('/(auth)/register');
  };

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  return (
    <LinearBackground>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Image
                source={require('@/assets/logos/logoplover.png')}
                resizeMode="contain"
                style={styles.logo}
              />
            </View>
          </View>

          <View style={styles.content}>
            <Text style={[styles.title, { color: palette.text }]}>Dites bonjour</Text>
            <Text style={[styles.title, { color: palette.text }]}>à plover</Text>
            <Text style={[styles.subtitle, { color: palette.textSecondary }]}>
              Suivez vos patients et personnalisez le suivi parodontal avec une expérience simple et
              rassurante.
            </Text>
          </View>

          <View style={styles.actions}>
            <Button title="CRÉER VOTRE COMPTE" onPress={handleCreateAccount}>
            </Button>

            <Button title="CONNECTEZ-VOUS" variant="outline" onPress={handleLogin}>
             
            </Button>
          </View>
        </View>
    </LinearBackground>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingVertical: 48,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'flex-start',
  },
  logoCircle: {
    height: 64,
    width: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(109, 69, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: 48,
    width: 48,
  },
  content: {
    gap: 12,
  },
  title: {
    fontSize: 42,
    fontFamily: 'Outfit-Bold',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Outfit-Regular',
  },
  actions: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#6D45FF',
    paddingVertical: 18,
    borderRadius: 32,
    alignItems: 'center',
    shadowColor: '#6D45FF',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    letterSpacing: 1,
  },
  secondaryButton: {
    paddingVertical: 18,
    borderRadius: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6D45FF',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    letterSpacing: 1,
  },
});

