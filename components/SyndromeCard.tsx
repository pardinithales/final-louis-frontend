import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { ArrowRight } from 'lucide-react-native';

type Syndrome = {
  syndrome: string;
  artery: string;
  lesion_site: string;
};

type SyndromeCardProps = {
  syndrome: Syndrome;
  onPress?: () => void;
  isActive?: boolean;
};

export default function SyndromeCard({ 
  syndrome, 
  onPress,
  isActive = false
}: SyndromeCardProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        isActive && styles.activeCard
      ]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.syndromeText}>{syndrome.syndrome}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Artéria:</Text>
          <Text style={styles.value}>{syndrome.artery}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Localização:</Text>
          <Text style={styles.value}>{syndrome.lesion_site}</Text>
        </View>
      </View>
      
      <View style={styles.iconContainer}>
        <ArrowRight size={20} color={isActive ? Colors.white : Colors.primary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    borderRadius: Layout.borderRadius.m,
    padding: Layout.spacing.m,
    marginVertical: Layout.spacing.s,
    marginHorizontal: Layout.spacing.m,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activeCard: {
    backgroundColor: Colors.primary,
    borderLeftColor: Colors.primaryDark,
  },
  contentContainer: {
    flex: 1,
  },
  syndromeText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: Colors.text,
    marginBottom: Layout.spacing.s,
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: Layout.spacing.xs,
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.textSecondary,
    marginRight: Layout.spacing.xs,
  },
  value: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingLeft: Layout.spacing.s,
  },
});