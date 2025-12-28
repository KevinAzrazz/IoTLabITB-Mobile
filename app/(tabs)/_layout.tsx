import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors, GradientColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const gradientColors = GradientColors[colorScheme];

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.tabIconDefault,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            backgroundColor: colors.navBarBackground,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            position: 'absolute',
            elevation: 0,
          },
          sceneStyle: { backgroundColor: 'transparent' },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color }) => <Ionicons size={24} name="home" color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Kontak',
            headerShown: false,
            tabBarIcon: ({ color }) => <Ionicons size={24} name="mail-outline" color={color} />,
          }}
        />
        <Tabs.Screen
          name="login"
          options={{
            title: 'Login',
            headerShown: false,
            tabBarIcon: ({ color }) => <Ionicons size={24} name="person-circle-outline" color={color} />,
          }}
        />
      </Tabs>
    </LinearGradient>
  );
}
