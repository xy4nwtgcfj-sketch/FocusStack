import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AufgabeItem from '../components/AufgabeItem';
import AufgabeFormModal from '../components/AufgabeFormModal';
import {
  aktualisiereAufgabe,
  ladeAufgaben,
  speichereAufgabe,
} from '../storage';
import { Aufgabe } from '../types';

export default function AufgabenScreen() {
  const [aufgaben, setAufgaben] = useState<Aufgabe[]>([]);
  const [modalSichtbar, setModalSichtbar] = useState(false);

  useFocusEffect(
    useCallback(() => {
      ladeAufgaben().then(setAufgaben);
    }, [])
  );

  async function handleToggle(id: string) {
    const aufgabe = aufgaben.find((a) => a.id === id);
    if (!aufgabe) return;
    const aktualisiert = await aktualisiereAufgabe(id, { erledigt: !aufgabe.erledigt });
    setAufgaben((prev) => prev.map((a) => (a.id === id ? aktualisiert : a)));
  }

  async function handleSave(daten: { titel: string; projekt?: string; geschaetzteDauer: number }) {
    const neu = await speichereAufgabe(daten);
    setAufgaben((prev) => [neu, ...prev]);
  }

  const offene = aufgaben.filter((a) => !a.erledigt);
  const erledigte = aufgaben.filter((a) => a.erledigt);
  const sortiert = [...offene, ...erledigte];

  return (
    <View style={styles.container}>
      <FlatList
        data={sortiert}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AufgabeItem aufgabe={item} onToggle={handleToggle} />
        )}
        contentContainerStyle={sortiert.length === 0 ? styles.leerContainer : styles.liste}
        ListHeaderComponent={
          sortiert.length > 0 ? (
            <Text style={styles.anzahl}>
              {offene.length} offen · {erledigte.length} erledigt
            </Text>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.leer}>
            <Ionicons name="checkmark-circle-outline" size={64} color="#D1D5DB" />
            <Text style={styles.leerTitel}>Noch keine Aufgaben</Text>
            <Text style={styles.leerText}>
              Tippe auf "+" um deine erste Aufgabe hinzuzufügen.
            </Text>
          </View>
        }
      />

      <Pressable style={styles.fab} onPress={() => setModalSichtbar(true)}>
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>

      <AufgabeFormModal
        visible={modalSichtbar}
        onClose={() => setModalSichtbar(false)}
        onSave={handleSave}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  liste: {
    paddingTop: 16,
    paddingBottom: 100,
  },
  leerContainer: {
    flex: 1,
  },
  anzahl: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  leer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  leerTitel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
  },
  leerText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4F6BFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F6BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
});
