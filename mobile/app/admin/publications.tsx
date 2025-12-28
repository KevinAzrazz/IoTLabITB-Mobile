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
  Linking,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/lib/supabase';

type Publication = {
  id: string;
  title: string;
  authors: string;
  year: number;
  url?: string;
  created_at: string;
};

export default function AdminPublications() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .order('year', { ascending: false });

      if (data) setPublications(data);
    } catch (error) {
      console.error('Error fetching publications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    Alert.alert(
      'Konfirmasi Hapus',
      `Yakin ingin menghapus publikasi "${title}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase.from('publications').delete().eq('id', id);
            if (!error) {
              Alert.alert('Berhasil', 'Publikasi berhasil dihapus');
              fetchPublications();
            } else {
              Alert.alert('Error', 'Gagal menghapus publikasi');
            }
          },
        },
      ]
    );
  };

  const filteredPublications = publications.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.authors.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchPublications(); }} tintColor={colors.primary} />
        }
      >
        {/* Logo Header */}
        <View style={styles.logoHeader}>
          <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
            <Ionicons name="flask" size={24} color="#fff" />
          </View>
          <Text style={[styles.logoText, { color: colors.text }]}>Publikasi Ilmiah</Text>
        </View>

        {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="search-outline" size={20} color={colors.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Cari publikasi..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Stats */}
      <View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="book" size={24} color="#a855f7" />
        <Text style={[styles.statsText, { color: colors.text }]}>Total {publications.length} Publikasi</Text>
      </View>

      {/* Publications List */}
      <View style={styles.publicationsList}>
        {filteredPublications.length === 0 ? (
          <View style={[styles.emptyContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="book-outline" size={48} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>Tidak ada publikasi ditemukan</Text>
          </View>
        ) : (
          filteredPublications.map((pub) => (
            <View key={pub.id} style={[styles.pubCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.pubContent}>
                <Text style={[styles.pubTitle, { color: colors.text }]} numberOfLines={2}>
                  {pub.title}
                </Text>
                <Text style={[styles.pubAuthors, { color: colors.textMuted }]} numberOfLines={1}>
                  {pub.authors}
                </Text>
                <View style={styles.pubMeta}>
                  <View style={[styles.yearBadge, { borderColor: colors.border }]}>
                    <Text style={[styles.yearText, { color: colors.textMuted }]}>{pub.year || '-'}</Text>
                  </View>
                  {pub.url && (
                    <TouchableOpacity
                      style={styles.linkButton}
                      onPress={() => Linking.openURL(pub.url!)}
                    >
                      <Ionicons name="link-outline" size={14} color={colors.primary} />
                      <Text style={[styles.linkText, { color: colors.primary }]}>Buka</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <View style={styles.pubActions}>
                <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.info + '20' }]}>
                  <Ionicons name="pencil-outline" size={18} color={colors.info} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.iconButton, { backgroundColor: colors.error + '20' }]}
                  onPress={() => handleDelete(pub.id, pub.title)}
                >
                  <Ionicons name="trash-outline" size={18} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Add Button */}
      <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]}>
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Tambah Publikasi Baru</Text>
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

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 15,
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

  // Publications List
  publicationsList: {
    gap: 10,
  },
  pubCard: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  pubContent: {
    flex: 1,
  },
  pubTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    lineHeight: 20,
  },
  pubAuthors: {
    fontSize: 12,
    marginBottom: 10,
  },
  pubMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  yearBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
  },
  yearText: {
    fontSize: 11,
    fontWeight: '500',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  linkText: {
    fontSize: 12,
    fontWeight: '500',
  },
  pubActions: {
    justifyContent: 'center',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
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
});
