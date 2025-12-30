import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormModal from '@/components/form-modal-v2';

type PageContent = {
  key: string;
  value: string;
};

type FormField = {
  name: string;
  label: string;
  placeholder: string;
  type?: 'text' | 'textarea';
  value: string;
  required?: boolean;
};

export default function AdminSettings() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [pageContent, setPageContent] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase.from('page_content').select('*');

      if (data) {
        const contentMap = new Map(data.map((item: PageContent) => [item.key, item.value]));
        setPageContent(contentMap);
      }
      if (error) console.error('Error fetching page content:', error);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
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

  const handleOpenEditModal = (key: string) => {
    setEditingKey(key);
    setModalVisible(true);
  };

  const handleSubmitForm = async (data: Record<string, string>) => {
    if (!editingKey) return;

    try {
      const { error } = await supabase
        .from('page_content')
        .update({ value: data.value.trim() })
        .eq('key', editingKey);

      if (!error) {
        Alert.alert('Berhasil', 'Konten berhasil diperbarui');
        fetchData();
      } else {
        throw new Error('Gagal memperbarui konten');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Terjadi kesalahan');
      throw error;
    }
  };

  const getFormFields = (): FormField[] => {
    if (!editingKey) return [];

    const label = editingKey.replace(/_/g, ' ').toUpperCase();
    const currentValue = pageContent.get(editingKey) || '';
    const isMultiline = ['about_content', 'contact_address', 'history'].includes(editingKey);

    return [
      {
        name: 'value',
        label: label,
        placeholder: `Masukkan nilai untuk ${label}`,
        type: isMultiline ? 'textarea' : 'text',
        value: currentValue,
        required: true,
      },
    ];
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
            <Ionicons name="document-text" size={24} color="#fff" />
          </View>
          <Text style={[styles.logoText, { color: colors.text }]}>Konten Halaman</Text>
        </View>

        {/* Stats Card */}
        <View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="document-text" size={24} color="#3b82f6" />
          <Text style={[styles.statsText, { color: colors.text }]}>Kelola Konten Website</Text>
        </View>

        <>
          {/* Page Content - EDITABLE VERSION */}
          <View style={styles.contentList}>
            {/* Hero Title */}
            <View style={[styles.contentCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.contentHeader}>
                <Text style={[styles.contentLabel, { color: colors.textMuted }]}>Hero Title</Text>
                <TouchableOpacity
                  onPress={() => handleOpenEditModal('hero_title')}
                >
                  <Ionicons name="pencil" size={18} color={colors.primary} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.contentValue, { color: colors.text }]} numberOfLines={2}>
                {pageContent.get('hero_title') || '-'}
              </Text>
            </View>

            {/* Hero Subtitle */}
            <View style={[styles.contentCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.contentHeader}>
                <Text style={[styles.contentLabel, { color: colors.textMuted }]}>Hero Subtitle</Text>
                <TouchableOpacity
                  onPress={() => handleOpenEditModal('hero_subtitle')}
                >
                  <Ionicons name="pencil" size={18} color={colors.primary} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.contentValue, { color: colors.text }]} numberOfLines={2}>
                {pageContent.get('hero_subtitle') || '-'}
              </Text>
            </View>

            {/* About Title */}
            <View style={[styles.contentCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.contentHeader}>
                <Text style={[styles.contentLabel, { color: colors.textMuted }]}>About Title</Text>
                <TouchableOpacity
                  onPress={() => handleOpenEditModal('about_title')}
                >
                  <Ionicons name="pencil" size={18} color={colors.primary} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.contentValue, { color: colors.text }]} numberOfLines={2}>
                {pageContent.get('about_title') || '-'}
              </Text>
            </View>

            {/* About Content */}
            <View style={[styles.contentCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.contentHeader}>
                <Text style={[styles.contentLabel, { color: colors.textMuted }]}>About Content</Text>
                <TouchableOpacity
                  onPress={() => handleOpenEditModal('about_content')}
                >
                  <Ionicons name="pencil" size={18} color={colors.primary} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.contentValue, { color: colors.text }]} numberOfLines={3}>
                {pageContent.get('about_content') || '-'}
              </Text>
            </View>

            {/* Contact Email */}
            <View style={[styles.contentCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.contentHeader}>
                <Text style={[styles.contentLabel, { color: colors.textMuted }]}>Contact Email</Text>
                <TouchableOpacity
                  onPress={() => handleOpenEditModal('contact_email')}
                >
                  <Ionicons name="pencil" size={18} color={colors.primary} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.contentValue, { color: colors.text }]}>
                {pageContent.get('contact_email') || '-'}
              </Text>
            </View>

            {/* Contact Phone */}
            <View style={[styles.contentCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.contentHeader}>
                <Text style={[styles.contentLabel, { color: colors.textMuted }]}>Contact Phone</Text>
                <TouchableOpacity
                  onPress={() => handleOpenEditModal('contact_phone')}
                >
                  <Ionicons name="pencil" size={18} color={colors.primary} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.contentValue, { color: colors.text }]}>
                {pageContent.get('contact_phone') || '-'}
              </Text>
            </View>

            {/* Contact Address */}
            <View style={[styles.contentCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.contentHeader}>
                <Text style={[styles.contentLabel, { color: colors.textMuted }]}>Contact Address</Text>
                <TouchableOpacity
                  onPress={() => handleOpenEditModal('contact_address')}
                >
                  <Ionicons name="pencil" size={18} color={colors.primary} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.contentValue, { color: colors.text }]} numberOfLines={2}>
                {pageContent.get('contact_address') || '-'}
              </Text>
            </View>
          </View>

          {/* Info Card */}
          <View style={[styles.noteCard, { backgroundColor: colors.info + '20', borderColor: colors.info }]}>
            <Ionicons name="information-circle" size={20} color={colors.info} />
            <Text style={[styles.noteText, { color: colors.text }]}>
              Klik ikon pensil untuk mengedit konten. Untuk mengedit gambar, gunakan panel admin di website.
            </Text>
          </View>
        </>

      {/* Logout Button */}
      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: colors.error }]}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Keluar dari Admin</Text>
      </TouchableOpacity>

      {/* Form Modal */}
      <FormModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingKey(null);
        }}
        onSubmit={handleSubmitForm}
        fields={getFormFields()}
        title={editingKey ? `Edit ${editingKey.replace(/_/g, ' ')}` : 'Edit Konten'}
        submitButtonText="Simpan"
      />
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
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
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