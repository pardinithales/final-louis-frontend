import React from 'react';
import { StyleSheet, Text, View, Image, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { BrainCircuit, Search } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import LouisHeader from '@/components/LouisHeader';
import ScreenContainer from '@/components/ScreenContainer';

export default function HomeScreen() {
  const router = useRouter();
  
  const navigateToSearch = () => {
    router.push('/search');
  };

  return (
    <View style={styles.container}>
      <LouisHeader 
        title="LouiS" 
        subtitle="Localização Neurológica de AVC" 
      />
      
      <ScreenContainer>
        <View style={styles.heroContainer}>
          <View style={styles.heroContent}>
            <BrainCircuit size={60} color={Colors.primary} style={styles.heroIcon} />
            <Text style={styles.heroTitle}>LouiS</Text>
            <Text style={styles.heroSubtitle}>
              Sistema de Apoio à Localização Neurológica de AVC
            </Text>
            
            <TouchableOpacity 
              style={styles.searchButton}
              onPress={navigateToSearch}
            >
              <Search size={24} color={Colors.white} style={styles.searchIcon} />
              <Text style={styles.searchButtonText}>Iniciar Consulta</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.infoContainer}>
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Como utilizar o LouiS?</Text>
              <Text style={styles.infoText}>
                1. Descreva os sinais e sintomas neurológicos do paciente
              </Text>
              <Text style={styles.infoText}>
                2. Obtenha análise de possíveis localizações de AVC
              </Text>
              <Text style={styles.infoText}>
                3. Visualize imagens de ressonância magnética relevantes
              </Text>
              <Text style={styles.infoText}>
                4. Acesse referências e justificativas detalhadas
              </Text>
            </View>
            
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Recursos</Text>
              <Text style={styles.resourceText}>
                ✓ Identificação de síndromes vasculares
              </Text>
              <Text style={styles.resourceText}>
                ✓ Correlação com territórios arteriais
              </Text>
              <Text style={styles.resourceText}>
                ✓ Visualização de imagens radiológicas
              </Text>
              <Text style={styles.resourceText}>
                ✓ Referências da literatura médica
              </Text>
              <Text style={styles.resourceText}>
                ✓ Interface intuitiva para uso clínico
              </Text>
            </View>
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
  heroContainer: {
    padding: Layout.spacing.m,
  },
  heroContent: {
    alignItems: 'center',
    padding: Layout.spacing.xl,
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.l,
    marginBottom: Layout.spacing.l,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  heroIcon: {
    marginBottom: Layout.spacing.m,
  },
  heroTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 26,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Layout.spacing.s,
  },
  heroSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Layout.spacing.xl,
  },
  searchButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingVertical: Layout.spacing.m,
    paddingHorizontal: Layout.spacing.xl,
    borderRadius: Layout.borderRadius.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    marginRight: Layout.spacing.s,
  },
  searchButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.white,
  },
  infoContainer: {
    flexDirection: Platform.OS === 'web' && Layout.window.width > 768 ? 'row' : 'column',
  },
  infoCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.l,
    padding: Layout.spacing.l,
    marginBottom: Layout.spacing.l,
    marginRight: Platform.OS === 'web' && Layout.window.width > 768 ? Layout.spacing.l : 0,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: Colors.primary,
    marginBottom: Layout.spacing.m,
  },
  infoText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    color: Colors.text,
    marginBottom: Layout.spacing.m,
  },
  resourceText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    color: Colors.text,
    marginBottom: Layout.spacing.m,
  },
});