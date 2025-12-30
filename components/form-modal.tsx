import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type FormField = {
  name: string;
  label: string;
  placeholder: string;
  type?: 'text' | 'email' | 'number' | 'textarea' | 'dropdown';
  options?: { label: string; value: string }[];
  value: string;
  required?: boolean;
};

type MemberFormModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, string>) => Promise<void>;
  fields: FormField[];
  title: string;
  submitButtonText?: string;
};

export default function FormModal({
  visible,
  onClose,
  onSubmit,
  fields,
  title,
  submitButtonText = 'Simpan',
}: MemberFormModalProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [formData, setFormData] = useState<Record<string, string>>(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: field.value }), {})
  );
  const [loading, setLoading] = useState(false);

  // Update formData ketika fields atau visible berubah
  useEffect(() => {
    if (visible) {
      setFormData(fields.reduce((acc, field) => ({ ...acc, [field.name]: field.value }), {}));
    }
  }, [visible, fields]);

  const handleFieldChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    for (const field of fields) {
      if (field.required && !formData[field.name]?.trim()) {
        Alert.alert('Validasi', `${field.label} tidak boleh kosong`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      await onSubmit(formData);
      setFormData(fields.reduce((acc, field) => ({ ...acc, [field.name]: field.value }), {}));
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
              <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
              <TouchableOpacity onPress={onClose} disabled={loading}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <ScrollView style={styles.formContainer} contentContainerStyle={styles.formContent}>
              {fields.map((field, index) => (
                <View key={field.name} style={[styles.fieldContainer, index > 0 && { marginTop: 4 }]}>
                  <View style={styles.labelRow}>
                    <Text style={[styles.label, { color: colors.text }]}>
                      {field.label}
                    </Text>
                    {field.required && <Text style={styles.requiredBadge}>Wajib</Text>}
                  </View>
                  <Text style={[styles.fieldDescription, { color: colors.textMuted }]}>
                    {field.placeholder}
                  </Text>

                  {field.type === 'dropdown' ? (
                    <View style={[styles.dropdownContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dropdownOptions}>
                        {field.options?.map((option) => (
                          <TouchableOpacity
                            key={option.value}
                            style={[
                              styles.dropdownOption,
                              {
                                backgroundColor: formData[field.name] === option.value ? colors.primary : colors.card,
                                borderColor: formData[field.name] === option.value ? colors.primary : colors.border,
                              },
                            ]}
                            onPress={() => handleFieldChange(field.name, option.value)}
                          >
                            <Text
                              style={[
                                styles.dropdownOptionText,
                                { color: formData[field.name] === option.value ? '#fff' : colors.text },
                              ]}
                            >
                              {option.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  ) : field.type === 'textarea' ? (
                    <TextInput
                      style={[styles.textarea, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
                      placeholder={field.placeholder}
                      placeholderTextColor={colors.textMuted}
                      value={formData[field.name]}
                      onChangeText={(value) => handleFieldChange(field.name, value)}
                      multiline
                      numberOfLines={4}
                    />
                  ) : (
                    <TextInput
                      style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
                      placeholder={field.placeholder}
                      placeholderTextColor={colors.textMuted}
                      value={formData[field.name]}
                      onChangeText={(value) => handleFieldChange(field.name, value)}
                      keyboardType={field.type === 'number' ? 'numeric' : field.type === 'email' ? 'email-address' : 'default'}
                      editable={!loading}
                    />
                  )}
                </View>
              ))}
            </ScrollView>

            {/* Footer Actions */}
            <View style={[styles.footer, { borderTopColor: colors.border }]}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={onClose}
                disabled={loading}
              >
                <Text style={[styles.buttonText, { color: colors.text }]}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.submitButton, { backgroundColor: colors.primary }]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={[styles.buttonText, { color: '#fff' }]}>{submitButtonText}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: '90%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  formContainer: {
    flex: 1,
    minHeight: 200,
  },
  formContent: {
    padding: 16,
    paddingBottom: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  requiredBadge: {
    fontSize: 11,
    fontWeight: '700',
    backgroundColor: '#ef4444',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  fieldDescription: {
    fontSize: 12,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
  },
  textarea: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  dropdownContainer: {
    position: 'relative',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    paddingHorizontal: 0,
  },
  dropdownOptions: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dropdownOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownOptionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  dropdownIcon: {
    position: 'absolute',
    right: 10,
    top: '50%',
    marginTop: -10,
    zIndex: 1,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  submitButton: {
    borderWidth: 0,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
