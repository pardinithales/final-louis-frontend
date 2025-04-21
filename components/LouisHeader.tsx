import React from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { SquareActivity as ActivitySquare } from 'lucide-react-native';

type HeaderProps = {
  title: string;
  subtitle?: string;
  showLogo?: boolean;
};

export default function LouisHeader({ 
  title, 
  subtitle, 
  showLogo = true 
}: HeaderProps) {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[
      styles.header, 
      { paddingTop: Platform.OS === 'web' ? Layout.spacing.xl : insets.top + Layout.spacing.m }
    ]}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          {showLogo && (
            <View style={styles.logoContainer}>
              <ActivitySquare size={30} color={Colors.primary} />
            </View>
          )}
          <View>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: Layout.spacing.m,
  },
  container: {
    paddingHorizontal: Layout.spacing.l,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    marginRight: Layout.spacing.m,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: Colors.textSecondary,
    marginTop: -2,
  },
});