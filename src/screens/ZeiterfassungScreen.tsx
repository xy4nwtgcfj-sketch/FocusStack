import { StyleSheet, Text, View } from 'react-native';

export default function ZeiterfassungScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zeiterfassung</Text>
      <Text style={styles.subtitle}>Verfolge deine Zeit hier.</Text>
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
