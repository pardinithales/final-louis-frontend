import React, { useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import LouisHeader from '@/components/LouisHeader';
import ScreenContainer from '@/components/ScreenContainer';
import SearchBox from '@/components/SearchBox';
import AnalysisResult from '@/components/AnalysisResult';
import { queryLouisAPI, ParsedResponseType } from '@/api/louisService';
import { addSearchToHistory } from '@/models/searchHistory';

export default function SearchScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ParsedResponseType | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await queryLouisAPI(query);
      
      if (response) {
        setResult(response);
        addSearchToHistory(response);
      } else {
        setError('Não foi possível obter resultados. Tente novamente.');
      }
    } catch (err) {
      setError('Ocorreu um erro ao processar sua consulta. Tente novamente mais tarde.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <LouisHeader title="Consulta" subtitle="Descreva os sintomas neurológicos" />
      
      <ScreenContainer>
        <View style={styles.searchContainer}>
          <Text style={styles.instructionText}>
            Descreva os sinais e sintomas neurológicos do paciente para identificação da localização do AVC
          </Text>
          
          <SearchBox 
            onSearch={handleSearch} 
            isLoading={isLoading}
            placeholder="Ex: Paciente apresenta alterações sensitivas trigeminais ipsilaterais, alterações sensitivas contralaterais..."
          />
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Analisando dados clínicos...</Text>
          </View>
        ) : result ? (
          <AnalysisResult result={result} />
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>
              Descreva os sinais e sintomas do paciente para obter análise neurológica.
            </Text>
            <Text style={styles.exampleText}>
              Exemplo: "Paciente apresenta alterações sensitivas trigeminais ipsilaterais, alterações sensitivas contralaterais, disfagia, disartria e síndrome de Horner ipsilateral."
            </Text>
          </View>
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
  searchContainer: {
    marginBottom: Layout.spacing.l,
  },
  instructionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: Colors.textSecondary,
    marginHorizontal: Layout.spacing.m,
    marginBottom: Layout.spacing.s,
  },
  errorContainer: {
    backgroundColor: Colors.errorLight,
    padding: Layout.spacing.m,
    marginHorizontal: Layout.spacing.m,
    marginTop: Layout.spacing.m,
    borderRadius: Layout.borderRadius.m,
  },
  errorText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.errorDark,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.xl,
  },
  loadingText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: Layout.spacing.m,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.xl,
  },
  placeholderText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Layout.spacing.l,
  },
  exampleText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.textTertiary,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: Layout.spacing.xl,
  },
});