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

type FormModalProps = {
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
}: FormModalProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Update formData ketika modal dibuka atau fields berubah
  useEffect(() => {
    if (visible) {
      const initialData = fields.reduce((acc, field) => ({ 
        ...acc, 
        [field.name]: field.value 
      }), {});
      setFormData(initialData);
    }
  }, [visible, fields]);

  const handleFieldChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    for (const field of fields) {
      if (field.required && !formData[field.name]?.trim()) {
        Alert.alert('Validasi Error', `${field.label} tidak boleh kosong`);
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
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      visible={visible} 
      transparent 
      animationType="slide" 
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
              <Text style={[styles.title, { color: colors.text }]}>
                {title}
              </Text>
              <TouchableOpacity 
                onPress={onClose} 
                disabled={loading}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Form Fields - Scrollable */}
            <ScrollView 
              style={styles.formContainer}
              contentContainerStyle={styles.formContent}
              showsVerticalScrollIndicator={true}
            >
              {fields.length === 0 ? (
                <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                  Tidak ada field untuk diisi
                </Text>
              ) : (
                fields.map((field) => (
                  <View key={field.name} style={styles.fieldWrapper}>
                    {/* Label & Required Badge */}
                    <View style={styles.labelContainer}>
                      <Text style={[styles.label, { color: colors.text }]}>
                        {field.label}
                      </Text>
                      {field.required && (
                        <View style={styles.requiredBadge}>
                          <Text style={styles.requiredText}>Wajib</Text>
                        </View>
                      )}
                    </View>

                    {/* Description */}
                    <Text style={[styles.description, { color: colors.textMuted }]}>
                      {field.placeholder}
                    </Text>

                    {/* Input Field */}
                    {field.type === 'dropdown' ? (
                      // Dropdown Options
                      <View style={[styles.dropdownWrapper, { borderColor: colors.border }]}>
                        <ScrollView 
                          horizontal 
                          showsHorizontalScrollIndicator={false}
                        >
                          {field.options?.map((option) => (
                            <TouchableOpacity
                              key={option.value}
                              style={[
                                styles.dropdownOption,
                                {
                                  backgroundColor: formData[field.name] === option.value 
                                    ? colors.primary 
                                    : colors.card,
                                  borderColor: formData[field.name] === option.value
                                    ? colors.primary
                                    : colors.border,
                                },
                              ]}
                              onPress={() => handleFieldChange(field.name, option.value)}
                            >
                              <Text
                                style={[
                                  styles.dropdownOptionText,
                                  {
                                    color: formData[field.name] === option.value 
                                      ? '#fff' 
                                      : colors.text,
                                  },
                                ]}
                              >
                                {option.label}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    ) : field.type === 'textarea' ? (
                      // Textarea Input
                      <TextInput
                        style={[
                          styles.textarea,
                          { 
                            color: colors.text,
                            borderColor: colors.border,
                            backgroundColor: colors.card,
                          },
                        ]}
                        placeholder={field.placeholder}
                        placeholderTextColor={colors.textMuted}
                        value={formData[field.name] || ''}
                        onChangeText={(value) => handleFieldChange(field.name, value)}
                        multiline
                        numberOfLines={4}
                        editable={!loading}
                      />
                    ) : (
                      // Text/Email/Number Input
                      <TextInput
                        style={[
                          styles.input,
                          { 
                            color: colors.text,
                            borderColor: colors.border,
                            backgroundColor: colors.card,
                          },
                        ]}
                        placeholder={field.placeholder}
                        placeholderTextColor={colors.textMuted}
                        value={formData[field.name] || ''}
                        onChangeText={(value) => handleFieldChange(field.name, value)}
                        keyboardType={
                          field.type === 'number' 
                            ? 'numeric' 
                            : field.type === 'email' 
                              ? 'email-address' 
                              : 'default'
                        }
                        editable={!loading}
                      />
                    )}
                  </View>
                ))
              )}
            </ScrollView>

            {/* Footer Actions */}
            <View style={[styles.footer, { borderTopColor: colors.border }]}>
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
                onPress={onClose}
                disabled={loading}
              >
                <Text style={[styles.buttonText, { color: colors.text }]}>
                  Batal
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  styles.submitButton,
                  {
                    backgroundColor: colors.primary,
                  },
                ]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={[styles.buttonText, { color: '#fff' }]}>
                    {submitButtonText}
                  </Text>
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    height: '95%',
    display: 'flex',
    flexDirection: 'column',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    flex: 1,
  },

  // Form Container
  formContainer: {
    flex: 1,
  },
  formContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },

  // Field Wrapper
  fieldWrapper: {
    marginBottom: 28,
  },

  // Label
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  requiredBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  },
  requiredText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },

  // Description
  description: {
    fontSize: 13,
    marginBottom: 12,
    fontStyle: 'italic',
    lineHeight: 18,
  },

  // Text Input
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontWeight: '500',
  },

  // Textarea Input
  textarea: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontWeight: '500',
    textAlignVertical: 'top',
    minHeight: 120,
  },

  // Dropdown
  dropdownWrapper: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  dropdownOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Empty State
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 50,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  submitButton: {
    borderWidth: 0,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
