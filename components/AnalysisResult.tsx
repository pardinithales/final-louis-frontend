import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronUp, ChevronDown } from 'lucide-react-native';
import { ParsedResponseType } from '@/api/louisService';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import SyndromeCard from './SyndromeCard';
import ImageViewer from './ImageViewer';

type AnalysisResultProps = {
  result: ParsedResponseType;
};

export default function AnalysisResult({ result }: AnalysisResultProps) {
  const [selectedSyndromeIndex, setSelectedSyndromeIndex] = useState(0);
  const [isReferencesExpanded, setIsReferencesExpanded] = useState(true);
  
  if (!result || !result.syndromes || result.syndromes.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noResultsText}>Nenhum resultado encontrado para a consulta.</Text>
      </View>
    );
  }
  
  const selectedSyndrome = result.syndromes[selectedSyndromeIndex];
  
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Síndromes Identificadas</Text>
        <Text style={styles.queryText}>Consulta: "{result.query}"</Text>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.syndromesList}
          contentContainerStyle={styles.syndromesListContent}
        >
          {result.syndromes.map((syndrome, index) => (
            <View key={index} style={styles.syndromeCardWrapper}>
              <SyndromeCard 
                syndrome={syndrome} 
                onPress={() => setSelectedSyndromeIndex(index)}
                isActive={index === selectedSyndromeIndex}
              />
            </View>
          ))}
        </ScrollView>
      </View>
      
      {selectedSyndromeIndex === 0 && result.imageUrl && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Imagem de Ressonância</Text>
          <Text style={styles.locationText}>
            Localização: <Text style={styles.locationHighlight}>{result.syndromes[0]?.lesion_site}</Text>
          </Text>
          <ImageViewer 
            imageUri={result.imageUrl} 
            title={`Imagem ilustrativa de lesão em ${result.syndromes[0]?.lesion_site}`}
          />
        </View>
      )}
      
      {result.notes && result.notes.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Observações Clínicas</Text>
          <View style={styles.notesList}>
            {result.notes.map((note, index) => (
              <View key={index} style={styles.noteItem}>
                <Text style={styles.noteNumber}>{index + 1}</Text>
                <Text style={styles.noteText}>{note}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      
      {result.retrievedChunks && result.retrievedChunks.length > 0 && (
        <View style={styles.section}>
          <TouchableOpacity onPress={() => setIsReferencesExpanded(!isReferencesExpanded)} style={styles.collapsibleHeader}>
            <Text style={styles.sectionTitle}>Referências</Text>
            {isReferencesExpanded ? <ChevronUp size={20} color={Colors.primary} /> : <ChevronDown size={20} color={Colors.primary} />}
          </TouchableOpacity>
          {isReferencesExpanded && (
            <View style={styles.referencesList}>
              {result.retrievedChunks.map((chunk, index) => (
                <View key={index} style={styles.referenceItem}>
                  <Text style={styles.referenceScore}>
                    {Math.round(chunk.score * 100)}% relevância
                  </Text>
                  <Text style={styles.referenceText} numberOfLines={3}>
                    {chunk.text}
                  </Text>
                  <Text style={styles.referenceSource}>
                    Fonte: {chunk.source}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Layout.spacing.m,
  },
  section: {
    marginBottom: Layout.spacing.xl,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: Colors.primary,
    marginBottom: Layout.spacing.s,
  },
  queryText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: Layout.spacing.m,
  },
  syndromesList: {
    marginTop: Layout.spacing.s,
  },
  syndromesListContent: {
    paddingRight: Layout.spacing.m,
  },
  syndromeCardWrapper: {
    width: 300,
    marginRight: Layout.spacing.m,
  },
  locationText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Layout.spacing.s,
  },
  locationHighlight: {
    fontFamily: 'Poppins-Medium',
    color: Colors.text,
  },
  notesList: {
    marginTop: Layout.spacing.s,
  },
  noteItem: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.m,
    paddingLeft: Layout.spacing.s,
  },
  noteNumber: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: Colors.primary,
    width: 24,
    textAlign: 'center',
  },
  noteText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text,
    flex: 1,
    marginLeft: Layout.spacing.m,
  },
  referencesList: {
    marginTop: Layout.spacing.s,
  },
  referenceItem: {
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
  referenceScore: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.primary,
    marginBottom: Layout.spacing.xs,
  },
  referenceText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text,
    marginBottom: Layout.spacing.s,
  },
  referenceSource: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.textTertiary,
    fontStyle: 'italic',
  },
  noResultsText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Layout.spacing.xl,
  },
  collapsibleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.s,
  },
});