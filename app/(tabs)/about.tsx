import React from 'react';
import { StyleSheet, View, Text, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { ExternalLink } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import LouisHeader from '@/components/LouisHeader';
import ScreenContainer from '@/components/ScreenContainer';

export default function AboutScreen() {
  const openLink = (url: string) => {
    Linking.openURL(url);
  };
  
  return (
    <View style={styles.container}>
      <LouisHeader title="Sobre o LouiS" subtitle="Informações e recursos" />
      
      <ScreenContainer>
        <View style={styles.contentContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>O que é o LouiS?</Text>
            <Text style={styles.paragraph}>
              LouiS é um sistema especializado em localização neurológica de AVC (Acidente Vascular Cerebral) utilizando tecnologia de Retrieval-Augmented Generation (RAG).
            </Text>
            <Text style={styles.paragraph}>
              Desenvolvido para auxiliar profissionais de saúde na identificação precisa da localização anatômica de lesões vasculares cerebrais, o LouiS analisa descrições clínicas e correlaciona com síndromes vasculares conhecidas.
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recursos Principais</Text>
            
            <View style={styles.featureItem}>
              <Text style={styles.featureTitle}>Análise Neurológica Avançada</Text>
              <Text style={styles.featureDescription}>
                Identificação de síndromes vasculares específicas com base em sinais e sintomas clínicos.
              </Text>
            </View>
            
            <View style={styles.featureItem}>
              <Text style={styles.featureTitle}>Visualização Radiológica</Text>
              <Text style={styles.featureDescription}>
                Exibição de imagens de ressonância magnética correspondentes às localizações anatômicas identificadas.
              </Text>
            </View>
            
            <View style={styles.featureItem}>
              <Text style={styles.featureTitle}>Base de Conhecimento Médico</Text>
              <Text style={styles.featureDescription}>
                Referências da literatura médica especializada para embasar as análises e correlações clínicas.
              </Text>
            </View>
            
            <View style={styles.featureItem}>
              <Text style={styles.featureTitle}>Suporte à Decisão Clínica</Text>
              <Text style={styles.featureDescription}>
                Auxílio na tomada de decisão diagnóstica e terapêutica com base na localização precisa do AVC.
              </Text>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Como Utilizar</Text>
            <Text style={styles.paragraph}>
              1. Descreva os sintomas neurológicos do paciente
            </Text>
            <Text style={styles.paragraph}>
              2. Obtenha análise de possíveis localizações de AVC
            </Text>
            <Text style={styles.paragraph}>
              3. Visualize imagens de ressonância magnética relevantes
            </Text>
            <Text style={styles.paragraph}>
              4. Acesse referências e justificativas detalhadas
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Desenvolvimento e Orientação</Text>
            <Text style={styles.paragraph}>
              Desenvolvido por Thales Pardini Fagundes, médico neurologista formado pelo Hospital das Clínicas de Riberão Preto (HCFMRP-USP).
            </Text>
            <Text style={styles.paragraph}>
              O projeto é orientado por Millene Rodrigues Camilo em parceria com o João Brainer Clares de Andrade (UNIFESP).
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contato e Suporte</Text>
            <TouchableOpacity 
              style={styles.linkButton}
              onPress={() => openLink('mailto:pardinithales@gmail.com')}
            >
              <Text style={styles.linkText}>pardinithales@gmail.com</Text>
              <ExternalLink size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              © 2024 LouiS Stroke Project - Todos os direitos reservados
            </Text>
            <Text style={styles.versionText}>
              LouiS Stroke v1.0.0
            </Text>
          </View>
        </View>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: Layout.spacing.m,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.l,
    padding: Layout.spacing.l,
    marginBottom: Layout.spacing.l,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: Colors.primary,
    marginBottom: Layout.spacing.m,
  },
  paragraph: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    color: Colors.text,
    marginBottom: Layout.spacing.m,
    lineHeight: 22,
  },
  featureItem: {
    marginBottom: Layout.spacing.l,
  },
  featureTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.text,
    marginBottom: Layout.spacing.xs,
  },
  featureDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.m,
  },
  linkText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: Colors.primary,
    marginRight: Layout.spacing.xs,
  },
  footer: {
    alignItems: 'center',
    marginTop: Layout.spacing.l,
    marginBottom: Layout.spacing.xl,
  },
  footerText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginBottom: Layout.spacing.s,
  },
  versionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.textTertiary,
  },
});