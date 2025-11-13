import { LinearGradient } from "expo-linear-gradient";
import { ColorValue, StyleSheet, useColorScheme } from "react-native";

const gradientLight = ['#F3F1FF', '#F4FBFF', '#FFF0FF'];
const gradientDark = ['#1B1D2A', '#1F2231', '#1A1F2B'];

export function LinearBackground({ children }: { children: React.ReactNode }) {
    const colorScheme = useColorScheme() ?? 'light';
  const gradientColors = colorScheme === 'dark' ? gradientDark : gradientLight;
  return (
    <LinearGradient style={styles.gradient} colors={gradientColors as [ColorValue, ColorValue, ...ColorValue[]]}>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});