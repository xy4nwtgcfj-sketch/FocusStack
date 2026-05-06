import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import HeuteScreen from './src/screens/HeuteScreen';
import AufgabenScreen from './src/screens/AufgabenScreen';
import ZeiterfassungScreen from './src/screens/ZeiterfassungScreen';

type RootTabParamList = {
  Heute: undefined;
  Aufgaben: undefined;
  Zeiterfassung: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const icons: Record<keyof RootTabParamList, keyof typeof Ionicons.glyphMap> = {
              Heute: 'home',
              Aufgaben: 'list',
              Zeiterfassung: 'time',
            };
            return <Ionicons name={icons[route.name]} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#8E8E93',
          headerShown: true,
        })}
      >
        <Tab.Screen name="Heute" component={HeuteScreen} />
        <Tab.Screen name="Aufgaben" component={AufgabenScreen} />
        <Tab.Screen name="Zeiterfassung" component={ZeiterfassungScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
