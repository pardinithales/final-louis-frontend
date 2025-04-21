import React, { ReactNode } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';

type ScreenContainerProps = {
  children: ReactNode;
  scrollable?: boolean;
  style?: object;
  contentContainerStyle?: object;
};

export default function ScreenContainer({ 
  children, 
  scrollable = true,
  style,
  contentContainerStyle,
}: ScreenContainerProps) {
  if (scrollable) {
    return (
      <ScrollView
        style={[styles.container, style]}
        contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.container, styles.contentContainer, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingBottom: 80, // Extra space to account for the tab bar
  },
});