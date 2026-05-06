import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type FormData = {
  titel: string;
  projekt: string;
  geschaetzteDauer: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (daten: { titel: string; projekt?: string; geschaetzteDauer: number }) => void;
};

export default function AufgabeFormModal({ visible, onClose, onSave }: Props) {
  const [form, setForm] = useState<FormData>({ titel: '', projekt: '', geschaetzteDauer: '' });

  function handleSave() {
    if (!form.titel.trim()) return;
    onSave({
      titel: form.titel.trim(),
      projekt: form.projekt.trim() || undefined,
      geschaetzteDauer: parseInt(form.geschaetzteDauer, 10) || 25,
    });
    setForm({ titel: '', projekt: '', geschaetzteDauer: '' });
    onClose();
  }

  function handleClose() {
    setForm({ titel: '', projekt: '', geschaetzteDauer: '' });
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <Pressable style={styles.backdrop} onPress={handleClose} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.heading}>Neue Aufgabe</Text>

        <Text style={styles.label}>Titel *</Text>
        <TextInput
          style={styles.input}
          placeholder="Was muss erledigt werden?"
          placeholderTextColor="#9CA3AF"
          value={form.titel}
          onChangeText={(v) => setForm((f) => ({ ...f, titel: v }))}
          autoFocus
          returnKeyType="next"
        />

        <Text style={styles.label}>Projekt</Text>
        <TextInput
          style={styles.input}
          placeholder="z. B. FocusStack"
          placeholderTextColor="#9CA3AF"
          value={form.projekt}
          onChangeText={(v) => setForm((f) => ({ ...f, projekt: v }))}
          returnKeyType="next"
        />

        <Text style={styles.label}>Geschätzte Dauer (Minuten)</Text>
        <TextInput
          style={styles.input}
          placeholder="25"
          placeholderTextColor="#9CA3AF"
          value={form.geschaetzteDauer}
          onChangeText={(v) => setForm((f) => ({ ...f, geschaetzteDauer: v.replace(/[^0-9]/g, '') }))}
          keyboardType="number-pad"
          returnKeyType="done"
        />

        <Pressable
          style={[styles.saveButton, !form.titel.trim() && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!form.titel.trim()}
        >
          <Text style={styles.saveButtonText}>Speichern</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: '#111827',
  },
  saveButton: {
    backgroundColor: '#4F6BFF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonDisabled: {
    backgroundColor: '#C7D0FF',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
