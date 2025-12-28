import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Partner = {
  id: string;
  name: string;
  logo_url: string;
  created_at: string;
};

export default function AdminPartners() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setPartners(data);
      if (error) console.error('Error fetching partners:', error);
    } catch (error) {
      console.error('Error fetching partners:', error);
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
              fetchPartners();
            } else {
              Alert.alert('Error', 'Gagal menghapus mitra');
            }
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
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchPartners();
            }}
            tintColor={colors.primary}
          />
        }
      >
        {/* Logo Header */}
        <View style={styles.logoHeader}>
          <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
            <Ionicons name="business" size={24} color="#fff" />
          </View>
          <Text style={[styles.logoText, { color: colors.text }]}>Mitra & Funding</Text>
        </View>

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

        {/* Info Card */}
        <View style={[styles.noteCard, { backgroundColor: colors.info + '20', borderColor: colors.info }]}>
          <Ionicons name="information-circle" size={20} color={colors.info} />
          <Text style={[styles.noteText, { color: colors.text }]}>
            Kelola mitra dan sponsor yang bekerjasama dengan laboratorium. Logo mitra akan ditampilkan di halaman utama.
          </Text>
        </View>
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
});
