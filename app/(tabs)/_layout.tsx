import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { Chrome as Home, Search, History, Info } from 'lucide-react-native';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          ...styles.tabBar,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.inactiveTint,
        tabBarLabelStyle: styles.tabLabel,
        tabBarHoverStyle: styles.tabHover,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <Home color={color} size={size} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <Search color={color} size={size} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <History color={color} size={size} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <Info color={color} size={size} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopColor: Colors.lightGray,
    borderTopWidth: 1,
    paddingTop: 8,
  },
  tabLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
  },
  tabHover: {
    opacity: 0.8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});