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
import FormModal from '@/components/form-modal-v2';

type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  slug: string;
  image_url: string;
  created_at: string;
};

type FormField = {
  name: string;
  label: string;
  placeholder: string;
  type?: 'text' | 'textarea' | 'dropdown';
  options?: { label: string; value: string }[];
  value: string;
  required?: boolean;
};

export default function AdminProjects() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const categories = ['all', 'S1', 'S2', 'S3'];

  useEffect(() => {
    fetchProjects();
  }, [categoryFilter]);

  const fetchProjects = async () => {
    try {
      let query = supabase.from('projects').select('*').order('created_at', { ascending: false });
      
      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }

      const { data, error } = await query;
      if (data) setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    Alert.alert(
      'Konfirmasi Hapus',
      `Yakin ingin menghapus proyek "${title}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase.from('projects').delete().eq('id', id);
            if (!error) {
              Alert.alert('Berhasil', 'Proyek berhasil dihapus');
              fetchProjects();
            } else {
              Alert.alert('Error', 'Gagal menghapus proyek');
            }
          },
        },
      ]
    );
  };

  const handleOpenAddModal = () => {
    setEditingProject(null);
    setModalVisible(true);
  };

  const handleOpenEditModal = (project: Project) => {
    setEditingProject(project);
    setModalVisible(true);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSubmitForm = async (data: Record<string, string>) => {
    try {
      
      const projectData = {
        title: data.title,
        description: data.description,
        category: data.category,
        image_url: data.image_url || null,
        slug: generateSlug(data.title),
        members: '',
      };
      
      if (editingProject) {
        const { data: result, error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingProject.id)
          .select();
        fetchProjects();
      } else {
        const { data: result, error } = await supabase
          .from('projects')
          .insert([projectData])
          .select();
        fetchProjects();
      }
    } catch (error: any) {
      console.error('=== FORM SUBMISSION ERROR ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      Alert.alert('Error', error.message || 'Terjadi kesalahan');
      throw error;
    }
  };

  const getFormFields = (): FormField[] => {
    return [
      {
        name: 'title',
        label: 'Judul Proyek',
        placeholder: 'Masukkan judul proyek',
        type: 'text',
        value: editingProject?.title || '',
        required: true,
      },
      {
        name: 'description',
        label: 'Deskripsi',
        placeholder: 'Masukkan deskripsi proyek',
        type: 'textarea',
        value: editingProject?.description || '',
        required: true,
      },
      {
        name: 'category',
        label: 'Kategori',
        placeholder: 'Pilih kategori',
        type: 'dropdown',
        options: [
          { label: 'S1', value: 'S1' },
          { label: 'S2', value: 'S2' },
          { label: 'S3', value: 'S3' },
        ],
        value: editingProject?.category || 'S1',
        required: true,
      },
      {
        name: 'image_url',
        label: 'URL Gambar (Optional)',
        placeholder: 'https://example.com/image.jpg',
        type: 'text',
        value: editingProject?.image_url || '',
        required: false,
      },
    ];
  };

  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'S1': return '#3b82f6';
      case 'S2': return '#22c55e';
      case 'S3': return '#a855f7';
      default: return colors.textMuted;
    }
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
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchProjects(); }} tintColor={colors.primary} />
        }
      >
        {/* Logo Header */}
        <View style={styles.logoHeader}>
          <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
            <Ionicons name="flask" size={24} color="#fff" />
          </View>
          <Text style={[styles.logoText, { color: colors.text }]}>Proyek & Riset</Text>
        </View>

        {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="search-outline" size={20} color={colors.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Cari proyek..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setCategoryFilter(cat)}
            style={[
              styles.filterChip,
              {
                backgroundColor: categoryFilter === cat ? colors.primary : colors.card,
                borderColor: categoryFilter === cat ? colors.primary : colors.border,
              },
            ]}
          >
            <Text style={[styles.filterText, { color: categoryFilter === cat ? '#fff' : colors.text }]}>
              {cat === 'all' ? 'Semua' : cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Projects List */}
      <View style={styles.projectsList}>
        {filteredProjects.length === 0 ? (
          <View style={[styles.emptyContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="folder-open-outline" size={48} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>Tidak ada proyek ditemukan</Text>
          </View>
        ) : (
          filteredProjects.map((project) => (
            <View key={project.id} style={[styles.projectCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {project.image_url && (
                <Image source={{ uri: project.image_url }} style={styles.projectImage} />
              )}
              <View style={styles.projectContent}>
                <View style={styles.projectHeader}>
                  <Text style={[styles.projectTitle, { color: colors.text }]} numberOfLines={2}>
                    {project.title}
                  </Text>
                  <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(project.category) + '20' }]}>
                    <Text style={[styles.categoryText, { color: getCategoryColor(project.category) }]}>
                      {project.category}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.projectDesc, { color: colors.textMuted }]} numberOfLines={2}>
                  {project.description}
                </Text>
                <View style={styles.projectActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.info + '20' }]}
                    onPress={() => handleOpenEditModal(project)}
                  >
                    <Ionicons name="pencil-outline" size={16} color={colors.info} />
                    <Text style={[styles.actionText, { color: colors.info }]}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.error + '20' }]}
                    onPress={() => handleDelete(project.id, project.title)}
                  >
                    <Ionicons name="trash-outline" size={16} color={colors.error} />
                    <Text style={[styles.actionText, { color: colors.error }]}>Hapus</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Add Button */}
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={handleOpenAddModal}
      >
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Tambah Proyek Baru</Text>
      </TouchableOpacity>

      {/* Form Modal */}
      <FormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmitForm}
        fields={getFormFields()}
        title={editingProject ? 'Edit Proyek' : 'Tambah Proyek Baru'}
        submitButtonText={editingProject ? 'Perbarui' : 'Tambahkan'}
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

  // Filter
  filterContainer: {
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Projects List
  projectsList: {
    gap: 12,
  },
  projectCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  projectImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  projectContent: {
    padding: 14,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  projectTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    marginRight: 8,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  projectDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  projectActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
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
