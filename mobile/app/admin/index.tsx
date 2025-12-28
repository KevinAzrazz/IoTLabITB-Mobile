import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';

type DashboardStats = {
  projects: number;
  members: number;
  publications: number;
  partners: number;
};

type ActivityLog = {
  id: string;
  action: string;
  entity_type: string;
  description: string;
  created_at: string;
};

export default function AdminDashboard() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [stats, setStats] = useState<DashboardStats>({
    projects: 0,
    members: 0,
    publications: 0,
    partners: 0,
  });
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch counts
      const [projectsRes, membersRes, publicationsRes, partnersRes, activitiesRes] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact' }),
        supabase.from('members').select('id', { count: 'exact' }),
        supabase.from('publications').select('id', { count: 'exact' }),
        supabase.from('partners').select('id', { count: 'exact' }),
        supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(5),
      ]);

      setStats({
        projects: projectsRes.count || 0,
        members: membersRes.count || 0,
        publications: publicationsRes.count || 0,
        partners: partnersRes.count || 0,
      });

      if (activitiesRes.data) {
        setActivities(activitiesRes.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/(tabs)');
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create': return '➕';
      case 'update': return '✏️';
      case 'delete': return '🗑️';
      default: return '📝';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create': return colors.success;
      case 'update': return colors.info;
      case 'delete': return colors.error;
      default: return colors.textMuted;
    }
  };

  const statCards = [
    { title: 'Total Proyek', value: stats.projects, icon: 'briefcase-outline', color: '#3b82f6', desc: 'Proyek riset aktif' },
    { title: 'Anggota Tim', value: stats.members, icon: 'people-outline', color: '#22c55e', desc: 'Peneliti dan asisten' },
    { title: 'Publikasi', value: stats.publications, icon: 'book-outline', color: '#a855f7', desc: 'Paper dipublikasikan' },
    { title: 'Mitra', value: stats.partners, icon: 'business-outline', color: '#f97316', desc: 'Partner kerjasama' },
  ];

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: 'transparent' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: 'transparent' }]} edges={['top']}>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* Logo Header */}
        <View style={styles.logoHeader}>
          <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
            <Ionicons name="flask" size={24} color="#fff" />
          </View>
          <Text style={[styles.logoText, { color: colors.text }]}>IoT Lab Admin</Text>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Dashboard Admin</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
            Selamat datang di panel administrasi IoT Lab ITB
          </Text>
        </View>

      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        {statCards.map((stat, index) => (
          <View key={index} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.statHeader}>
              <Text style={[styles.statTitle, { color: colors.textMuted }]}>{stat.title}</Text>
              <Ionicons name={stat.icon as any} size={20} color={stat.color} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
            <Text style={[styles.statDesc, { color: colors.textMuted }]}>{stat.desc}</Text>
          </View>
        ))}
      </View>

      {/* Recent Activity */}
      <View style={[styles.activityCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.activityHeader}>
          <Ionicons name="time-outline" size={20} color={colors.text} />
          <Text style={[styles.activityTitle, { color: colors.text }]}>Aktivitas Terbaru</Text>
        </View>

        {activities.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>Belum ada aktivitas terbaru</Text>
        ) : (
          <View style={styles.activityList}>
            {activities.map((activity) => (
              <View key={activity.id} style={[styles.activityItem, { backgroundColor: colorScheme === 'dark' ? colors.backgroundSecondary : '#f9fafb' }]}>
                <Text style={styles.activityIcon}>{getActionIcon(activity.action)}</Text>
                <View style={styles.activityContent}>
                  <Text style={[styles.activityDesc, { color: colors.text }]} numberOfLines={2}>
                    {activity.description}
                  </Text>
                  <View style={styles.activityMeta}>
                    <Text style={[styles.activityAction, { color: getActionColor(activity.action) }]}>
                      {activity.action === 'create' ? 'Dibuat' : activity.action === 'update' ? 'Diperbarui' : 'Dihapus'}
                    </Text>
                    <Text style={[styles.activityDot, { color: colors.textMuted }]}>•</Text>
                    <Text style={[styles.activityType, { color: colors.textMuted }]}>{activity.entity_type}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Tips Card */}
      <LinearGradient
        colors={[`${colors.primary}20`, `${colors.accent}20`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.tipsCard, { borderColor: colors.border }]}
      >
        <View style={styles.tipsHeader}>
          <Ionicons name="trending-up-outline" size={20} color={colors.primary} />
          <Text style={[styles.tipsTitle, { color: colors.text }]}>Tips Pengelolaan</Text>
        </View>
        <View style={styles.tipsList}>
          <Text style={[styles.tipItem, { color: colors.textMuted }]}>• Pastikan semua proyek memiliki gambar dan deskripsi lengkap</Text>
          <Text style={[styles.tipItem, { color: colors.textMuted }]}>• Update publikasi secara berkala</Text>
          <Text style={[styles.tipItem, { color: colors.textMuted }]}>• Jaga informasi anggota tim tetap up-to-date</Text>
          <Text style={[styles.tipItem, { color: colors.textMuted }]}>• Tambahkan mitra baru untuk kredibilitas lab</Text>
        </View>
      </LinearGradient>

      {/* Logout Button */}
      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: colors.error }]}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Keluar dari Admin</Text>
      </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Logo Header
  logoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
  },

  // Header
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  statDesc: {
    fontSize: 11,
  },

  // Activity Card
  activityCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  activityList: {
    gap: 10,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 12,
    borderRadius: 8,
  },
  activityIcon: {
    fontSize: 20,
  },
  activityContent: {
    flex: 1,
  },
  activityDesc: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activityAction: {
    fontSize: 11,
    fontWeight: '600',
  },
  activityDot: {
    fontSize: 11,
  },
  activityType: {
    fontSize: 11,
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 14,
  },

  // Tips Card
  tipsCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  tipsList: {
    gap: 6,
  },
  tipItem: {
    fontSize: 13,
    lineHeight: 20,
  },

  // Logout Button
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
