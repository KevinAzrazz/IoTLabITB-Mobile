import { useEffect, useState, useMemo, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Image,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Dimensions,
  ImageBackground,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// --- TIPE DATA ---
type Project = {
  id: string;
  title: string;
  category: string;
  image_url: string;
  description?: string;
  slug?: string;
};

type Member = {
  id: string;
  name: string;
  role: string;
  image_url?: string;
};

type Publication = {
  id: string;
  title: string;
  authors: string;
  year?: number;
  url?: string;
};

type Partner = {
  id: string;
  name: string;
  logo_url: string;
};

type PageContent = {
  key: string;
  value: string;
};

// --- KATEGORI FILTER ---
const CATEGORIES = ['all', 'S1', 'S2', 'S3'];

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const scrollViewRef = useRef<ScrollView>(null);
  const [projectsSectionY, setProjectsSectionY] = useState(0);
  
  const [filter, setFilter] = useState('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  // Page Content
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [aboutTitle, setAboutTitle] = useState('');
  const [aboutContent, setAboutContent] = useState('');
  const [aboutImage, setAboutImage] = useState('');
  const [historyContent, setHistoryContent] = useState('');
  const [historyImage, setHistoryImage] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAllData();
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [projectsRes, membersRes, publicationsRes, partnersRes, pageContentRes] = await Promise.all([
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('members').select('*'),
        supabase.from('publications').select('*').order('year', { ascending: false }),
        supabase.from('partners').select('*'),
        supabase.from('page_content').select('*'),
      ]);

      if (projectsRes.data) setProjects(projectsRes.data);
      if (membersRes.data) setMembers(membersRes.data);
      if (publicationsRes.data) setPublications(publicationsRes.data);
      if (partnersRes.data) setPartners(partnersRes.data);

      if (pageContentRes.data) {
        const contentMap = new Map(pageContentRes.data.map((item: PageContent) => [item.key, item.value]));
        setHeroTitle(contentMap.get('hero_title') || '');
        setHeroSubtitle(contentMap.get('hero_subtitle') || '');
        setHeroImage(contentMap.get('hero_image') || '');
        setAboutTitle(contentMap.get('about_title') || '');
        setAboutContent(contentMap.get('about_content') || '');
        setAboutImage(contentMap.get('about_image') || '');
        setHistoryContent(contentMap.get('history_content') || '');
        setHistoryImage(contentMap.get('history_image') || '');
      }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };  const filteredProjects = useMemo(() => {
    if (filter === 'all') return projects;
    return projects.filter((p) => p.category.toLowerCase() === filter.toLowerCase());
  }, [filter, projects]);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: 'transparent' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textMuted }]}>Memuat Data Lab...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]} edges={['top']}>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* ==================== HERO SECTION ==================== */}
        <View style={styles.heroSection}>
          <ImageBackground
            source={{ uri: heroImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800' }}
            style={styles.heroBackground}
            blurRadius={8}
          >
            <LinearGradient
              colors={[
                colorScheme === 'dark' ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.85)',
                colorScheme === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)',
              ]}
              style={styles.heroOverlay}
            >
              <View style={[styles.heroCard, { backgroundColor: colorScheme === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.85)' }]}>
                <Text style={[styles.heroTitle, { color: colors.text }]}>{heroTitle}</Text>
                <Text style={[styles.heroSubtitle, { color: colors.textMuted }]}>{heroSubtitle}</Text>
                <TouchableOpacity 
                  style={[styles.heroButton, { backgroundColor: colors.primary }]}
                  onPress={() => scrollViewRef.current?.scrollTo({ y: projectsSectionY, animated: true })}
                >
                  <Text style={styles.heroButtonText}>Lihat Proyek Kami</Text>
                  <Ionicons name="arrow-forward" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* ==================== ABOUT SECTION ==================== */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{aboutTitle}</Text>
          
          {aboutImage ? (
            <View style={styles.aboutImageContainer}>
              <Image source={{ uri: aboutImage }} style={styles.aboutImage} />
            </View>
          ) : null}
          
          <Text style={[styles.sectionContent, { color: colors.textMuted }]}>{aboutContent}</Text>
        </View>

        {/* ==================== HISTORY SECTION ==================== */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Sejarah Kami</Text>
          
          {historyImage ? (
            <View style={styles.aboutImageContainer}>
              <Image source={{ uri: historyImage }} style={styles.aboutImage} />
            </View>
          ) : null}
          
          <Text style={[styles.sectionContent, { color: colors.textMuted }]}>{historyContent}</Text>
        </View>

        {/* ==================== MEMBERS SECTION ==================== */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Member Lab</Text>
            <Text style={[styles.sectionDescription, { color: colors.textMuted }]}>
              Tim kami terdiri dari peneliti, dosen, dan mahasiswa yang berdedikasi untuk inovasi IoT.
            </Text>
          </View>

          {members.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>Belum ada data anggota tim</Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.membersScroll}>
              {members.map((member) => (
                <View key={member.id} style={[styles.memberCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={[styles.memberAvatar, { backgroundColor: colors.backgroundSecondary }]}>
                    {member.image_url ? (
                      <Image source={{ uri: member.image_url }} style={styles.memberAvatarImage} />
                    ) : (
                      <Ionicons name="person" size={32} color={colors.textMuted} />
                    )}
                  </View>
                  <Text style={[styles.memberName, { color: colors.text }]} numberOfLines={1}>{member.name}</Text>
                  <Text style={[styles.memberRole, { color: colors.textMuted }]} numberOfLines={1}>{member.role}</Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* ==================== PROJECTS SECTION ==================== */}
        <View 
          style={styles.section}
          onLayout={(event) => setProjectsSectionY(event.nativeEvent.layout.y)}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Riset & Proyek</Text>
            <Text style={[styles.sectionDescription, { color: colors.textMuted }]}>
              Jelajahi proyek-proyek inovatif yang sedang dan telah kami kerjakan di laboratorium.
            </Text>
          </View>

          {/* Filter Buttons */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => setFilter(category)}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor: filter === category ? colors.primary : colors.card,
                    borderColor: filter === category ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    { color: filter === category ? '#fff' : colors.text },
                  ]}
                >
                  {category === 'all' ? 'all' : category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="folder-open-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>Belum ada proyek riset</Text>
            </View>
          ) : (
            <View style={styles.projectsGrid}>
              {filteredProjects.map((project) => (
                <TouchableOpacity key={project.id} style={[styles.projectCard, { backgroundColor: colors.card, borderColor: colors.border }]} activeOpacity={0.9}>
                  <View style={styles.projectImageContainer}>
                    {project.image_url ? (
                      <Image source={{ uri: project.image_url }} style={styles.projectImage} />
                    ) : (
                      <View style={[styles.projectImage, styles.projectPlaceholder, { backgroundColor: colors.backgroundSecondary }]}>
                        <Ionicons name="image-outline" size={32} color={colors.textMuted} />
                      </View>
                    )}
                  </View>
                  <View style={styles.projectContent}>
                    <Text style={[styles.projectTitle, { color: colors.text }]} numberOfLines={2}>{project.title}</Text>
                    <Text style={[styles.projectDescription, { color: colors.textMuted }]} numberOfLines={2}>
                      {project.description || 'Klik untuk detail proyek'}
                    </Text>
                    <View style={[styles.projectBadge, { backgroundColor: colorScheme === 'dark' ? colors.backgroundSecondary : '#f3f4f6' }]}>
                      <Text style={[styles.projectBadgeText, { color: colors.textMuted }]}>{project.category}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* ==================== PUBLICATIONS SECTION ==================== */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Publikasi Ilmiah</Text>
            <Text style={[styles.sectionDescription, { color: colors.textMuted }]}>
              Riset terbaru kami yang dipublikasikan di jurnal dan konferensi internasional.
            </Text>
          </View>

          {publications.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>Belum ada publikasi ilmiah</Text>
          ) : (
            <View style={styles.publicationsList}>
              {publications.slice(0, 6).map((pub) => (
                <TouchableOpacity key={pub.id} style={[styles.publicationCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={[styles.publicationTitle, { color: colors.text }]} numberOfLines={2}>{pub.title}</Text>
                  <Text style={[styles.publicationAuthors, { color: colors.textMuted }]} numberOfLines={1}>{pub.authors}</Text>
                  <View style={[styles.publicationBadge, { borderColor: colors.border }]}>
                    <Text style={[styles.publicationYear, { color: colors.textMuted }]}>{pub.year || '-'}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* ==================== PARTNERS SECTION ==================== */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Partners & Funding</Text>
            <Text style={[styles.sectionDescription, { color: colors.textMuted }]}>
              Riset kami didukung oleh kolaborasi dengan industri terkemuka dan lembaga pendanaan.
            </Text>
          </View>

          {partners.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>Belum ada data mitra</Text>
          ) : (
            <View style={styles.partnersGrid}>
              {partners.map((partner) => (
                <View key={partner.id} style={[styles.partnerItem, { backgroundColor: colors.card }]}>
                  <Image
                    source={{ uri: partner.logo_url }}
                    style={styles.partnerLogo}
                    resizeMode="contain"
                  />
                </View>
              ))}
            </View>
          )}
        </View>

        {/* ==================== FOOTER ==================== */}
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>© 2025 IoT Lab</Text>
          <Text style={[styles.footerLink, { color: colors.accent }]}>Institut Teknologi Bandung</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 90,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },

  // Hero Section
  heroSection: {
    height: 380,
  },
  heroBackground: {
    flex: 1,
  },
  heroOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heroCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 36,
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  heroButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Section Common
  section: {
    padding: 24,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionEyebrow: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 400,
  },
  sectionContent: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'left',
  },

  // About/History Image
  aboutImageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  aboutImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },

  // Members
  membersScroll: {
    paddingHorizontal: 0,
    gap: 12,
  },
  memberCard: {
    width: 140,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  memberAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
  memberAvatarImage: {
    width: '100%',
    height: '100%',
  },
  memberName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 12,
    textAlign: 'center',
  },

  // Filter Buttons
  filterContainer: {
    paddingHorizontal: 0,
    marginBottom: 20,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  // Projects Grid
  projectsGrid: {
    gap: 16,
  },
  projectCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  projectImageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  projectImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  projectPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  projectContent: {
    padding: 16,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 22,
  },
  projectDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  projectBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  projectBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },

  // Publications
  publicationsList: {
    gap: 12,
  },
  publicationCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  publicationTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 22,
  },
  publicationAuthors: {
    fontSize: 13,
    marginBottom: 12,
  },
  publicationBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
  },
  publicationYear: {
    fontSize: 12,
    fontWeight: '500',
  },

  // Partners
  partnersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  partnerItem: {
    width: (width - 80) / 2,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    padding: 12,
  },
  partnerLogo: {
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },

  // Footer
  footer: {
    padding: 24,
    alignItems: 'center',
    borderTopWidth: 1,
  },
  footerText: {
    fontSize: 14,
    marginBottom: 4,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '500',
  },
});
