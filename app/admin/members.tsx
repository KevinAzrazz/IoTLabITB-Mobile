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

type Member = {
  id: string;
  name: string;
  role: string;
  image_url?: string;
  created_at: string;
};

export default function AdminMembers() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setMembers(data);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    Alert.alert(
      'Konfirmasi Hapus',
      `Yakin ingin menghapus anggota "${name}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase.from('members').delete().eq('id', id);
            if (!error) {
              Alert.alert('Berhasil', 'Anggota berhasil dihapus');
              fetchMembers();
            } else {
              Alert.alert('Error', 'Gagal menghapus anggota');
            }
          },
        },
      ]
    );
  };

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.role.toLowerCase().includes(searchQuery.toLowerCase())
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
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchMembers(); }} tintColor={colors.primary} />
        }
      >
        {/* Logo Header */}
        <View style={styles.logoHeader}>
          <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
            <Ionicons name="flask" size={24} color="#fff" />
          </View>
          <Text style={[styles.logoText, { color: colors.text }]}>Anggota Tim</Text>
        </View>

        {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="search-outline" size={20} color={colors.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Cari anggota tim..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Stats */}
      <View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="people" size={24} color={colors.primary} />
        <Text style={[styles.statsText, { color: colors.text }]}>Total {members.length} Anggota Tim</Text>
      </View>

      {/* Members List */}
      <View style={styles.membersList}>
        {filteredMembers.length === 0 ? (
          <View style={[styles.emptyContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="people-outline" size={48} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>Tidak ada anggota ditemukan</Text>
          </View>
        ) : (
          filteredMembers.map((member) => (
            <View key={member.id} style={[styles.memberCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.memberAvatar, { backgroundColor: colors.backgroundSecondary }]}>
                {member.image_url ? (
                  <Image source={{ uri: member.image_url }} style={styles.avatarImage} />
                ) : (
                  <Ionicons name="person" size={28} color={colors.textMuted} />
                )}
              </View>
              <View style={styles.memberInfo}>
                <Text style={[styles.memberName, { color: colors.text }]} numberOfLines={1}>
                  {member.name}
                </Text>
                <Text style={[styles.memberRole, { color: colors.textMuted }]} numberOfLines={1}>
                  {member.role}
                </Text>
              </View>
              <View style={styles.memberActions}>
                <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.info + '20' }]}>
                  <Ionicons name="pencil-outline" size={18} color={colors.info} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.iconButton, { backgroundColor: colors.error + '20' }]}
                  onPress={() => handleDelete(member.id, member.name)}
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
        <Text style={styles.addButtonText}>Tambah Anggota Baru</Text>
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

  // Members List
  membersList: {
    gap: 10,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  memberAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  memberRole: {
    fontSize: 13,
  },
  memberActions: {
    flexDirection: 'row',
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
