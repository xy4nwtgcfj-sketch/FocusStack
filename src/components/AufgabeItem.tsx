import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Aufgabe } from '../types';

type Props = {
  aufgabe: Aufgabe;
  onToggle: (id: string) => void;
};

export default function AufgabeItem({ aufgabe, onToggle }: Props) {
  return (
    <View style={styles.card}>
      <Pressable
        style={[styles.checkbox, aufgabe.erledigt && styles.checkboxChecked]}
        onPress={() => onToggle(aufgabe.id)}
        hitSlop={8}
      >
        {aufgabe.erledigt && (
          <Ionicons name="checkmark" size={14} color="#fff" />
        )}
      </Pressable>

      <View style={styles.content}>
        <Text style={[styles.titel, aufgabe.erledigt && styles.titelErledigt]} numberOfLines={1}>
          {aufgabe.titel}
        </Text>
        <View style={styles.meta}>
          {aufgabe.projekt ? (
            <View style={styles.projektBadge}>
              <Text style={styles.projektText}>{aufgabe.projekt}</Text>
            </View>
          ) : null}
          <Text style={styles.dauer}>
            <Ionicons name="time-outline" size={12} color="#9CA3AF" /> {aufgabe.geschaetzteDauer} Min.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  checkboxChecked: {
    backgroundColor: '#4F6BFF',
    borderColor: '#4F6BFF',
  },
  content: {
    flex: 1,
  },
  titel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  titelErledigt: {
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  projektBadge: {
    backgroundColor: '#EEF1FF',
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  projektText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4F6BFF',
  },
  dauer: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
