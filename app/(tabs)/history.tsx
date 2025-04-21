import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Trash2 } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import LouisHeader from '@/components/LouisHeader';
import ScreenContainer from '@/components/ScreenContainer';
import { getSearchHistory, clearSearchHistory } from '@/models/searchHistory';
import { ParsedResponseType } from '@/api/louisService';

export default function HistoryScreen() {
  const [history, setHistory] = useState<ParsedResponseType[]>([]);
  const router = useRouter();
  
  useEffect(() => {
    loadHistory();
  }, []);
  
  const loadHistory = () => {
    const searchHistory = getSearchHistory();
    setHistory(searchHistory);
  };
  
  const handleClearHistory = () => {
    clearSearchHistory();
    setHistory([]);
  };
  
  const handleSelectHistoryItem = (item: ParsedResponseType) => {
    // In a real app, navigate to the result screen with the selected item
    // For now, we'll just show it in the search screen
    router.push('/search');
  };
  
  const renderHistoryItem = ({ item }: { item: ParsedResponseType }) => {
    return (
      <TouchableOpacity 
        style={styles.historyItem}
        onPress={() => handleSelectHistoryItem(item)}
      >
        <View style={styles.historyContent}>
          <Text style={styles.historyQuery} numberOfLines={2}>
            {item.query}
          </Text>
          {item.syndromes && item.syndromes.length > 0 && (
            <Text style={styles.historySyndromes} numberOfLines={1}>
              {item.syndromes.map(s => s.syndrome).join(', ')}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={styles.container}>
      <LouisHeader title="Histórico" subtitle="Consultas anteriores" />
      
      <ScreenContainer>
        <View style={styles.headerContainer}>
          <Text style={styles.sectionTitle}>Histórico de Consultas</Text>
          
          {history.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={handleClearHistory}>
              <Trash2 size={16} color={Colors.accent} />
              <Text style={styles.clearButtonText}>Limpar</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Seu histórico de consultas está vazio.
            </Text>
            <Text style={styles.emptySubtext}>
              As consultas realizadas aparecerão aqui para referência futura.
            </Text>
          </View>
        ) : (
          <FlatList
            data={history}
            renderItem={renderHistoryItem}
            keyExtractor={(item, index) => `history-${index}`}
            contentContainerStyle={styles.list}
          />
        )}
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: Layout.spacing.m,
    marginVertical: Layout.spacing.m,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: Colors.primary,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.s,
  },
  clearButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.accent,
    marginLeft: Layout.spacing.xs,
  },
  list: {
    padding: Layout.spacing.m,
  },
  historyItem: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.m,
    padding: Layout.spacing.m,
    marginBottom: Layout.spacing.m,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  historyContent: {
    flex: 1,
  },
  historyQuery: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.text,
    marginBottom: Layout.spacing.xs,
  },
  historySyndromes: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.xl,
  },
  emptyText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Layout.spacing.m,
  },
  emptySubtext: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
});