import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

const DAUER_OPTIONEN = [15, 30, 45, 60, 90, 120];

type SaveData = {
  titel: string;
  projekt?: string;
  geschaetzteDauer: number;
  deadline?: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (daten: SaveData) => void;
};

export default function AufgabeFormModal({ visible, onClose, onSave }: Props) {
  const [titel, setTitel] = useState('');
  const [projekt, setProjekt] = useState('');
  const [dauer, setDauer] = useState(30);
  const [deadlineAktiv, setDeadlineAktiv] = useState(false);
  const [deadline, setDeadline] = useState(new Date());
  // Android zeigt den Picker nur als Dialog — wir steuern das über diesen Flag
  const [androidPickerOffen, setAndroidPickerOffen] = useState(false);

  function handleDateChange(_: DateTimePickerEvent, selectedDate?: Date) {
    if (Platform.OS === 'android') setAndroidPickerOffen(false);
    if (selectedDate) setDeadline(selectedDate);
  }

  function handleSave() {
    if (!titel.trim()) return;
    onSave({
      titel: titel.trim(),
      projekt: projekt.trim() || undefined,
      geschaetzteDauer: dauer,
      deadline: deadlineAktiv ? deadline.toISOString() : undefined,
    });
    resetForm();
    onClose();
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function resetForm() {
    setTitel('');
    setProjekt('');
    setDauer(30);
    setDeadlineAktiv(false);
    setDeadline(new Date());
  }

  function formatDatum(date: Date) {
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <Pressable style={styles.backdrop} onPress={handleClose} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.sheetWrapper}
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            <Text style={styles.heading}>Neue Aufgabe</Text>

            {/* Titel */}
            <Text style={styles.label}>Titel *</Text>
            <TextInput
              style={styles.input}
              placeholder="Was muss erledigt werden?"
              placeholderTextColor="#9CA3AF"
              value={titel}
              onChangeText={setTitel}
              autoFocus
              returnKeyType="next"
            />

            {/* Projekt */}
            <Text style={styles.label}>Projekt</Text>
            <TextInput
              style={styles.input}
              placeholder="z. B. FocusStack"
              placeholderTextColor="#9CA3AF"
              value={projekt}
              onChangeText={setProjekt}
              returnKeyType="done"
            />

            {/* Dauer-Chips */}
            <Text style={styles.label}>Geschätzte Dauer</Text>
            <View style={styles.chipRow}>
              {DAUER_OPTIONEN.map((min) => {
                const aktiv = dauer === min;
                return (
                  <Pressable
                    key={min}
                    style={[styles.chip, aktiv && styles.chipAktiv]}
                    onPress={() => setDauer(min)}
                  >
                    <Text style={[styles.chipText, aktiv && styles.chipTextAktiv]}>
                      {min < 60 ? `${min} min` : `${min / 60} h`}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Deadline */}
            <Text style={styles.label}>Deadline</Text>
            <Pressable
              style={styles.deadlineToggle}
              onPress={() => {
                const wird = !deadlineAktiv;
                setDeadlineAktiv(wird);
                if (wird && Platform.OS === 'android') setAndroidPickerOffen(true);
              }}
            >
              <Ionicons
                name={deadlineAktiv ? 'calendar' : 'calendar-outline'}
                size={18}
                color={deadlineAktiv ? '#4F6BFF' : '#9CA3AF'}
              />
              <Text style={[styles.deadlineToggleText, deadlineAktiv && styles.deadlineToggleTextAktiv]}>
                {deadlineAktiv ? formatDatum(deadline) : 'Keine Deadline'}
              </Text>
              {deadlineAktiv && (
                <Pressable
                  hitSlop={8}
                  onPress={() => setDeadlineAktiv(false)}
                  style={styles.deadlineClear}
                >
                  <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                </Pressable>
              )}
            </Pressable>

            {/* iOS: Inline-Picker */}
            {deadlineAktiv && Platform.OS === 'ios' && (
              <DateTimePicker
                value={deadline}
                mode="date"
                display="inline"
                minimumDate={new Date()}
                onChange={handleDateChange}
                locale="de-DE"
                accentColor="#4F6BFF"
                style={styles.iosPicker}
              />
            )}

            {/* Android: Dialog bei Tap auf Toggle */}
            {androidPickerOffen && Platform.OS === 'android' && (
              <DateTimePicker
                value={deadline}
                mode="date"
                display="default"
                minimumDate={new Date()}
                onChange={handleDateChange}
              />
            )}
          </ScrollView>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <Pressable style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>Abbrechen</Text>
            </Pressable>
            <Pressable
              style={[styles.saveButton, !titel.trim() && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={!titel.trim()}
            >
              <Text style={styles.saveButtonText}>Speichern</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheetWrapper: {
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
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
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  chipAktiv: {
    backgroundColor: '#EEF1FF',
    borderColor: '#4F6BFF',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  chipTextAktiv: {
    color: '#4F6BFF',
  },
  deadlineToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  deadlineToggleText: {
    flex: 1,
    fontSize: 15,
    color: '#9CA3AF',
  },
  deadlineToggleTextAktiv: {
    color: '#111827',
    fontWeight: '500',
  },
  deadlineClear: {
    marginLeft: 'auto',
  },
  iosPicker: {
    marginTop: 8,
    marginHorizontal: -8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 36,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  cancelButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '600',
  },
  saveButton: {
    flex: 2,
    backgroundColor: '#4F6BFF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#C7D0FF',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
