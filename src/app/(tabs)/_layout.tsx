import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';



export default function TabLayout() {
  // Force light mode only
  const colorScheme: 'light' = 'light';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme].background,
        },
      }}>
      <Tabs.Screen
        name="initial-access"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="check-in"
        options={{
          title: 'Check-in',
          tabBarIcon: ({ color }) => <FontAwesome6 name="teeth-open" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="articles"
        options={{
          title: 'Articles',
          tabBarIcon: ({ color }) => <FontAwesome6 name="newspaper" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="articles/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="medical-info"
        options={{
          title: 'Medical Info',
          tabBarIcon: ({ color }) => <FontAwesome5 name="file-medical" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome5 name="user-alt" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="onboarding"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
