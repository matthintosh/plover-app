import { LinearBackground } from "@/components/ui/LinearBackground";
import { Slot } from "expo-router";

export default function PatientProtectedLayout() {
  return <LinearBackground>
    <Slot />
  </LinearBackground>;
}