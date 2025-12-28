import { HapticTab } from '@/components/haptic-tab';
import { Colors, GradientColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import React from 'react';

export default function AdminLayout() {
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
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Ionicons name="grid-outline" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="projects"
          options={{
            title: 'Proyek',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Ionicons name="briefcase-outline" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="members"
          options={{
            title: 'Anggota',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Ionicons name="people-outline" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="publications"
          options={{
            title: 'Publikasi',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Ionicons name="book-outline" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="partners"
          options={{
            title: 'Mitra',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Ionicons name="business-outline" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Lainnya',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Ionicons name="ellipsis-horizontal-outline" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </LinearGradient>
  );
}
