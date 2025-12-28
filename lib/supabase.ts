import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import 'react-native-url-polyfill/auto';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Storage yang aman untuk SSR dan semua platform
const createSupabaseStorage = () => {
  // Cek apakah kita di environment browser/client
  const isBrowser = typeof window !== 'undefined';
  
  if (!isBrowser) {
    // Return mock storage untuk SSR
    return {
      getItem: () => Promise.resolve(null),
      setItem: () => Promise.resolve(),
      removeItem: () => Promise.resolve(),
    };
  }

  // Untuk web, gunakan localStorage
  if (Platform.OS === 'web') {
    return {
      getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
      setItem: (key: string, value: string) => {
        localStorage.setItem(key, value);
        return Promise.resolve();
      },
      removeItem: (key: string) => {
        localStorage.removeItem(key);
        return Promise.resolve();
      },
    };
  }

  // Untuk mobile (iOS/Android), gunakan AsyncStorage
  // Import secara dinamis untuk menghindari error di web
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  return AsyncStorage;
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: createSupabaseStorage(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});