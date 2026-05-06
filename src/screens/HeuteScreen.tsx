import { StyleSheet, Text, View } from 'react-native';

export default function HeuteScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Heute</Text>
      <Text style={styles.subtitle}>Deine heutigen Aufgaben erscheinen hier.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#888',
  },
});
