import React, { useState } from 'react';
import { 
  StyleSheet, 
  TextInput, 
  View, 
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Platform,
  Keyboard,
} from 'react-native';
import { Search, X } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';

type SearchBoxProps = {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
};

export default function SearchBox({ 
  onSearch, 
  isLoading = false, 
  placeholder = "Descreva os sintomas do paciente..." 
}: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  const handleSearch = () => {
    if (query.trim().length > 0) {
      onSearch(query.trim());
      if (Platform.OS !== 'web') {
        Keyboard.dismiss();
      }
    }
  };
  
  const clearInput = () => {
    setQuery('');
  };

  return (
    <View style={styles.container}>
      <View style={[
        styles.inputContainer,
        isFocused && styles.inputContainerFocused
      ]}>
        <Search 
          size={20} 
          color={Colors.textSecondary} 
          style={styles.searchIcon} 
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.textTertiary}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
          multiline={Platform.OS === 'web'}
          numberOfLines={Platform.OS === 'web' ? 3 : 1}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {query.length > 0 && (
          <TouchableOpacity 
            onPress={clearInput} 
            style={styles.clearButton}
            role="button"
            aria-label="Clear search"
          >
            <X size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      
      <TouchableOpacity 
        style={[
          styles.searchButton, 
          query.trim().length === 0 && styles.disabledButton,
          isLoading && styles.loadingButton
        ]}
        onPress={handleSearch}
        disabled={query.trim().length === 0 || isLoading}
        role="button"
        aria-label="Search"
      >
        {isLoading ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <Text style={styles.searchButtonText}>Buscar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Layout.spacing.m,
    marginVertical: Layout.spacing.m,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.m,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Layout.spacing.s,
    paddingHorizontal: Layout.spacing.m,
    paddingVertical: Platform.OS === 'web' ? Layout.spacing.s : 0,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    transition: 'all 0.2s ease',
  },
  inputContainerFocused: {
    borderColor: Colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  searchIcon: {
    marginRight: Layout.spacing.s,
  },
  input: {
    flex: 1,
    height: Platform.OS === 'web' ? 'auto' : 48,
    color: Colors.text,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    paddingVertical: Layout.spacing.s,
    outlineStyle: Platform.OS === 'web' ? 'none' : undefined,
  },
  clearButton: {
    padding: Layout.spacing.xs,
    cursor: 'pointer',
  },
  searchButton: {
    backgroundColor: Colors.primary,
    borderRadius: Layout.borderRadius.m,
    paddingVertical: Layout.spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  disabledButton: {
    backgroundColor: Colors.primaryLight,
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  loadingButton: {
    backgroundColor: Colors.primaryDark,
  },
  searchButtonText: {
    color: Colors.white,
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
});