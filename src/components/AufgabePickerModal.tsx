import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Aufgabe } from '../types';

type Props = {
  visible: boolean;
  aufgaben: Aufgabe[];
  ausgewaehlt: Aufgabe | null;
  onAuswaehlen: (aufgabe: Aufgabe) => void;
  onClose: () => void;
};

export default function AufgabePickerModal({
  visible,
  aufgaben,
  ausgewaehlt,
  onAuswaehlen,
  onClose,
}: Props) {
  const offene = aufgaben.filter((a) => !a.erledigt);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.heading}>Aufgabe wählen</Text>

        {offene.length === 0 ? (
          <View style={styles.leer}>
            <Text style={styles.leerText}>Keine offenen Aufgaben vorhanden.</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} style={styles.liste}>
            {offene.map((aufgabe) => {
              const aktiv = ausgewaehlt?.id === aufgabe.id;
              return (
                <Pressable
                  key={aufgabe.id}
                  style={[styles.row, aktiv && styles.rowAktiv]}
                  onPress={() => { onAuswaehlen(aufgabe); onClose(); }}
                >
                  <View style={styles.rowContent}>
                    <Text style={[styles.rowTitel, aktiv && styles.rowTitelAktiv]} numberOfLines={1}>
                      {aufgabe.titel}
                    </Text>
                    {aufgabe.projekt ? (
                      <Text style={styles.rowProjekt} numberOfLines={1}>
                        {aufgabe.projekt}
                      </Text>
                    ) : null}
                  </View>
                  <View style={styles.rowMeta}>
                    <Text style={styles.rowDauer}>{aufgabe.geschaetzteDauer} min</Text>
                    {aktiv && <Ionicons name="checkmark-circle" size={20} color="#4F6BFF" />}
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '75%',
    paddingBottom: 36,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  liste: {
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 4,
  },
  rowAktiv: {
    backgroundColor: '#EEF1FF',
  },
  rowContent: {
    flex: 1,
    gap: 2,
  },
  rowTitel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  rowTitelAktiv: {
    color: '#4F6BFF',
  },
  rowProjekt: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  rowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowDauer: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  leer: {
    padding: 32,
    alignItems: 'center',
  },
  leerText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});
