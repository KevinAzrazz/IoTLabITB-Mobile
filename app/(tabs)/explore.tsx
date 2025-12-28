import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  StatusBar,
  Alert,
  ActivityIndicator,
  Linking,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';

type PageContent = {
  key: string;
  value: string;
};

export default function ContactScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactAddress, setContactAddress] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const { data } = await supabase.from('page_content').select('*');
      if (data) {
        const contentMap = new Map(data.map((item: PageContent) => [item.key, item.value]));
        setContactEmail(contentMap.get('contact_email') || 'iot-lab@itb.ac.id');
        setContactPhone(contentMap.get('contact_phone') || '+62 22 XXX XXXX');
        setContactAddress(contentMap.get('contact_address') || 'Gedung Labtek V, ITB, Bandung');
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      Alert.alert('Error', 'Mohon lengkapi semua field');
      return;
    }

    setSubmitting(true);
    try {
      // Simulate sending (in real app, call your API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      Alert.alert('Error', 'Gagal mengirim pesan. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  const openEmail = () => {
    Linking.openURL(`mailto:${contactEmail}`);
  };

  const openPhone = () => {
    Linking.openURL(`tel:${contactPhone.replace(/\s/g, '')}`);
  };

  const openMaps = () => {
    const query = encodeURIComponent(contactAddress);
    Linking.openURL(`https://maps.google.com/?q=${query}`);
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: 'transparent' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header with Logo */}
          <View style={styles.logoHeader}>
            <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
              <Ionicons name="flask" size={24} color="#fff" />
            </View>
            <Text style={[styles.logoText, { color: colors.text }]}>IoT Lab</Text>
          </View>

          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Text style={[styles.heroTitle, { color: colors.text }]}>Hubungi Kami</Text>
            <Text style={[styles.heroSubtitle, { color: colors.textMuted }]}>
              Kami siap menjawab pertanyaan Anda tentang penelitian, kolaborasi, atau kunjungan ke lab
            </Text>
          </View>

          {/* Two Column Layout (Stacked on Mobile) */}
          <View style={styles.mainContent}>
            {/* Left Column - Form */}
            <View style={styles.formColumn}>
              {/* Success Alert */}
              {submitSuccess && (
                <View style={[styles.alertSuccess, { backgroundColor: '#dcfce7', borderColor: '#bbf7d0' }]}>
                  <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
                  <View style={styles.alertContent}>
                    <Text style={[styles.alertTitle, { color: '#166534' }]}>Pesan Terkirim!</Text>
                    <Text style={[styles.alertDescription, { color: '#15803d' }]}>
                      Terima kasih telah menghubungi kami. Tim kami akan segera merespons Anda.
                    </Text>
                  </View>
                </View>
              )}

              {/* Form */}
              <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Nama Lengkap</Text>
                  <TextInput
                    style={[styles.input, { 
                      backgroundColor: colors.background, 
                      borderColor: colors.border, 
                      color: colors.text 
                    }]}
                    placeholder="Nama Anda"
                    placeholderTextColor={colors.textMuted}
                    value={formData.name}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                    editable={!submitting}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Email</Text>
                  <TextInput
                    style={[styles.input, { 
                      backgroundColor: colors.background, 
                      borderColor: colors.border, 
                      color: colors.text 
                    }]}
                    placeholder="anda@email.com"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                    editable={!submitting}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Subjek</Text>
                  <TextInput
                    style={[styles.input, { 
                      backgroundColor: colors.background, 
                      borderColor: colors.border, 
                      color: colors.text 
                    }]}
                    placeholder="Subjek pesan Anda"
                    placeholderTextColor={colors.textMuted}
                    value={formData.subject}
                    onChangeText={(text) => setFormData({ ...formData, subject: text })}
                    editable={!submitting}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Pesan</Text>
                  <TextInput
                    style={[styles.textArea, { 
                      backgroundColor: colors.background, 
                      borderColor: colors.border, 
                      color: colors.text 
                    }]}
                    placeholder="Tulis pesan Anda di sini..."
                    placeholderTextColor={colors.textMuted}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                    value={formData.message}
                    onChangeText={(text) => setFormData({ ...formData, message: text })}
                    editable={!submitting}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.submitButton, { backgroundColor: colors.primary }]}
                  onPress={handleSubmit}
                  disabled={submitting}
                  activeOpacity={0.8}
                >
                  {submitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.submitButtonText}>Kirim Pesan</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Right Column - Contact Info */}
            <View style={styles.infoColumn}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>Informasi Kontak</Text>

              {/* Address Card */}
              <TouchableOpacity
                style={[styles.contactCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={openMaps}
                activeOpacity={0.7}
              >
                <View style={[styles.contactIconContainer, { backgroundColor: colorScheme === 'dark' ? colors.backgroundSecondary : '#f3f4f6' }]}>
                  <Ionicons name="location-outline" size={24} color={colors.primary} />
                </View>
                <View style={styles.contactCardContent}>
                  <Text style={[styles.contactCardTitle, { color: colors.text }]}>Alamat</Text>
                  <Text style={[styles.contactCardText, { color: colors.textMuted }]}>{contactAddress}</Text>
                </View>
              </TouchableOpacity>

              {/* Email Card */}
              <TouchableOpacity
                style={[styles.contactCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={openEmail}
                activeOpacity={0.7}
              >
                <View style={[styles.contactIconContainer, { backgroundColor: colorScheme === 'dark' ? colors.backgroundSecondary : '#f3f4f6' }]}>
                  <Ionicons name="mail-outline" size={24} color={colors.primary} />
                </View>
                <View style={styles.contactCardContent}>
                  <Text style={[styles.contactCardTitle, { color: colors.text }]}>Email</Text>
                  <Text style={[styles.contactCardText, { color: colors.primary }]}>{contactEmail}</Text>
                </View>
              </TouchableOpacity>

              {/* Phone Card */}
              <TouchableOpacity
                style={[styles.contactCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={openPhone}
                activeOpacity={0.7}
              >
                <View style={[styles.contactIconContainer, { backgroundColor: colorScheme === 'dark' ? colors.backgroundSecondary : '#f3f4f6' }]}>
                  <Ionicons name="call-outline" size={24} color={colors.primary} />
                </View>
                <View style={styles.contactCardContent}>
                  <Text style={[styles.contactCardTitle, { color: colors.text }]}>Telepon</Text>
                  <Text style={[styles.contactCardText, { color: colors.textMuted }]}>{contactPhone}</Text>
                </View>
              </TouchableOpacity>

              {/* Map Placeholder */}
              <View style={[styles.mapContainer, { backgroundColor: colorScheme === 'dark' ? colors.backgroundSecondary : '#f3f4f6', borderColor: colors.border }]}>
                <Ionicons name="map-outline" size={48} color={colors.textMuted} />
                <Text style={[styles.mapText, { color: colors.textMuted }]}>Peta Lokasi</Text>
                <TouchableOpacity
                  style={[styles.mapButton, { backgroundColor: colors.primary }]}
                  onPress={openMaps}
                >
                  <Text style={styles.mapButtonText}>Buka di Google Maps</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <Text style={[styles.footerText, { color: colors.textMuted }]}>© 2025 IoT Lab</Text>
            <Text style={[styles.footerLink, { color: colors.accent }]}>Institut Teknologi Bandung</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 90,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Hero Section
  heroSection: {
    paddingTop: 32,
    paddingBottom: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 400,
  },

  // Main Content
  mainContent: {
    padding: 20,
    gap: 24,
  },
  formColumn: {
    gap: 16,
  },
  infoColumn: {
    gap: 16,
  },

  // Alert
  alertSuccess: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    alignItems: 'flex-start',
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 14,
    lineHeight: 20,
  },

  // Form
  formContainer: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    minHeight: 140,
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Info Section
  infoTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 16,
  },
  contactIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactCardContent: {
    flex: 1,
  },
  contactCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  contactCardText: {
    fontSize: 14,
    lineHeight: 20,
  },

  // Map
  mapContainer: {
    height: 180,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  mapText: {
    fontSize: 14,
    fontWeight: '500',
  },
  mapButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },

  // Footer
  footer: {
    padding: 24,
    alignItems: 'center',
    borderTopWidth: 1,
    marginTop: 'auto',
  },
  footerText: {
    fontSize: 14,
    marginBottom: 4,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '500',
  },

  // Logo Header
  logoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    paddingBottom: 8,
    gap: 10,
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
  },
});
