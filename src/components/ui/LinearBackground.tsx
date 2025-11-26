import { LinearGradient } from "expo-linear-gradient";
import { ColorValue, StyleSheet } from "react-native";

const gradientLight = ['#F3F1FF', '#F4FBFF', '#FFF0FF'];

export function LinearBackground({ children }: { children: React.ReactNode }) {
  // Force light mode only
  const gradientColors = gradientLight;
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