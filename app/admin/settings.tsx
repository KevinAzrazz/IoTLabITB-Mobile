import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Alert,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';

type Partner = {
  id: string;
  name: string;
  logo_url: string;
  created_at: string;
};

type PageContent = {
  key: string;
  value: string;
};

export default function AdminSettings() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [partners, setPartners] = useState<Partner[]>([]);
  const [pageContent, setPageContent] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'partners' | 'content'>('partners');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [partnersRes, contentRes] = await Promise.all([
        supabase.from('partners').select('*').order('created_at', { ascending: false }),
        supabase.from('page_content').select('*'),
      ]);

      if (partnersRes.data) setPartners(partnersRes.data);
      if (contentRes.data) {
        const contentMap = new Map(contentRes.data.map((item: PageContent) => [item.key, item.value]));
        setPageContent(contentMap);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDeletePartner = async (id: string, name: string) => {
    Alert.alert(
      'Konfirmasi Hapus',
      `Yakin ingin menghapus mitra "${name}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase.from('partners').delete().eq('id', id);
            if (!error) {
              Alert.alert('Berhasil', 'Mitra berhasil dihapus');
              fetchData();
            } else {
              Alert.alert('Error', 'Gagal menghapus mitra');
            }
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      'Konfirmasi Keluar',
      'Yakin ingin keluar dari Admin?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: async () => {
            await supabase.auth.signOut();
            router.replace('/(tabs)');
          },
        },
      ]
    );
  };

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
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor={colors.primary} />
        }
      >
        {/* Logo Header */}
        <View style={styles.logoHeader}>
          <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
            <Ionicons name="flask" size={24} color="#fff" />
          </View>
          <Text style={[styles.logoText, { color: colors.text }]}>Pengaturan</Text>
        </View>

        {/* Tabs */}
      <View style={[styles.tabsContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'partners' && { backgroundColor: colors.primary }]}
          onPress={() => setActiveTab('partners')}
        >
          <Ionicons name="business-outline" size={18} color={activeTab === 'partners' ? '#fff' : colors.textMuted} />
          <Text style={[styles.tabText, { color: activeTab === 'partners' ? '#fff' : colors.textMuted }]}>
            Mitra & Funding
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'content' && { backgroundColor: colors.primary }]}
          onPress={() => setActiveTab('content')}
        >
          <Ionicons name="document-text-outline" size={18} color={activeTab === 'content' ? '#fff' : colors.textMuted} />
          <Text style={[styles.tabText, { color: activeTab === 'content' ? '#fff' : colors.textMuted }]}>
            Konten Halaman
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'partners' ? (
        <>
          {/* Partners Stats */}
          <View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="business" size={24} color="#f97316" />
            <Text style={[styles.statsText, { color: colors.text }]}>Total {partners.length} Mitra</Text>
          </View>

          {/* Partners List */}
          <View style={styles.partnersList}>
            {partners.length === 0 ? (
              <View style={[styles.emptyContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Ionicons name="business-outline" size={48} color={colors.textMuted} />
                <Text style={[styles.emptyText, { color: colors.textMuted }]}>Belum ada mitra</Text>
              </View>
            ) : (
              partners.map((partner) => (
                <View key={partner.id} style={[styles.partnerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={[styles.partnerLogo, { backgroundColor: colors.backgroundSecondary }]}>
                    {partner.logo_url ? (
                      <Image source={{ uri: partner.logo_url }} style={styles.logoImage} resizeMode="contain" />
                    ) : (
                      <Ionicons name="image-outline" size={24} color={colors.textMuted} />
                    )}
                  </View>
                  <Text style={[styles.partnerName, { color: colors.text }]} numberOfLines={1}>
                    {partner.name}
                  </Text>
                  <View style={styles.partnerActions}>
                    <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.info + '20' }]}>
                      <Ionicons name="pencil-outline" size={16} color={colors.info} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.iconButton, { backgroundColor: colors.error + '20' }]}
                      onPress={() => handleDeletePartner(partner.id, partner.name)}
                    >
                      <Ionicons name="trash-outline" size={16} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Add Partner Button */}
          <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]}>
            <Ionicons name="add" size={24} color="#fff" />
            <Text style={styles.addButtonText}>Tambah Mitra Baru</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* Page Content */}
          <View style={styles.contentList}>
            <View style={[styles.contentCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.contentLabel, { color: colors.textMuted }]}>Hero Title</Text>
              <Text style={[styles.contentValue, { color: colors.text }]}>{pageContent.get('hero_title') || '-'}</Text>
            </View>
            <View style={[styles.contentCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.contentLabel, { color: colors.textMuted }]}>Hero Subtitle</Text>
              <Text style={[styles.contentValue, { color: colors.text }]}>{pageContent.get('hero_subtitle') || '-'}</Text>
            </View>
            <View style={[styles.contentCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.contentLabel, { color: colors.textMuted }]}>About Title</Text>
              <Text style={[styles.contentValue, { color: colors.text }]}>{pageContent.get('about_title') || '-'}</Text>
            </View>
            <View style={[styles.contentCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.contentLabel, { color: colors.textMuted }]}>Contact Email</Text>
              <Text style={[styles.contentValue, { color: colors.text }]}>{pageContent.get('contact_email') || '-'}</Text>
            </View>
            <View style={[styles.contentCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.contentLabel, { color: colors.textMuted }]}>Contact Phone</Text>
              <Text style={[styles.contentValue, { color: colors.text }]}>{pageContent.get('contact_phone') || '-'}</Text>
            </View>
            <View style={[styles.contentCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.contentLabel, { color: colors.textMuted }]}>Contact Address</Text>
              <Text style={[styles.contentValue, { color: colors.text }]}>{pageContent.get('contact_address') || '-'}</Text>
            </View>
          </View>

          {/* Note */}
          <View style={[styles.noteCard, { backgroundColor: colors.warning + '20', borderColor: colors.warning }]}>
            <Ionicons name="information-circle" size={20} color={colors.warning} />
            <Text style={[styles.noteText, { color: colors.text }]}>
              Untuk mengedit konten halaman, gunakan panel admin di website.
            </Text>
          </View>
        </>
      )}

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

  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Stats
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  statsText: {
    fontSize: 15,
    fontWeight: '600',
  },

  // Partners List
  partnersList: {
    gap: 10,
  },
  partnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  partnerLogo: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  partnerName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  partnerActions: {
    flexDirection: 'row',
    gap: 6,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Content List
  contentList: {
    gap: 10,
  },
  contentCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  contentLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  contentValue: {
    fontSize: 14,
  },

  // Note
  noteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 16,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
  },

  // Empty
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 12,
    borderWidth: 1,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
  },

  // Add Button
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Logout Button
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
