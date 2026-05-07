import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AufgabePickerModal from '../components/AufgabePickerModal';
import {
  ladeAufgaben,
  ladeHeutigeZeiteintraege,
  speichereZeiteintrag,
} from '../storage';
import { Aufgabe, Zeiteintrag } from '../types';

function formatZeit(sekunden: number): string {
  const h = Math.floor(sekunden / 3600);
  const m = Math.floor((sekunden % 3600) / 60);
  const s = sekunden % 60;
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
}

function formatDauer(sekunden: number): string {
  if (sekunden < 60) return `${sekunden} Sek.`;
  const m = Math.floor(sekunden / 60);
  if (m < 60) return `${m} Min.`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return rest > 0 ? `${h} h ${rest} Min.` : `${h} h`;
}

function formatUhrzeit(iso: string): string {
  return new Date(iso).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

export default function ZeiterfassungScreen() {
  const [aufgaben, setAufgaben] = useState<Aufgabe[]>([]);
  const [aktiveAufgabe, setAktiveAufgabe] = useState<Aufgabe | null>(null);
  const [laeuft, setLaeuft] = useState(false);
  const [sekunden, setSekunden] = useState(0);
  const [eintraege, setEintraege] = useState<Zeiteintrag[]>([]);
  const [pickerSichtbar, setPickerSichtbar] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startZeitRef = useRef<Date | null>(null);

  useFocusEffect(
    useCallback(() => {
      ladeAufgaben().then(setAufgaben);
      ladeHeutigeZeiteintraege().then(setEintraege);
    }, [])
  );

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function handleStart() {
    if (!aktiveAufgabe) {
      setPickerSichtbar(true);
      return;
    }
    startZeitRef.current = new Date();
    setSekunden(0);
    intervalRef.current = setInterval(() => setSekunden((s) => s + 1), 1000);
    setLaeuft(true);
  }

  async function handleStop() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setLaeuft(false);

    if (!aktiveAufgabe || !startZeitRef.current) return;

    const endzeit = new Date();
    const dauer = Math.round((endzeit.getTime() - startZeitRef.current.getTime()) / 1000);

    const eintrag = await speichereZeiteintrag({
      aufgabeId: aktiveAufgabe.id,
      aufgabeTitel: aktiveAufgabe.titel,
      aufgabeProjekt: aktiveAufgabe.projekt,
      startzeit: startZeitRef.current.toISOString(),
      endzeit: endzeit.toISOString(),
      dauerSekunden: dauer,
    });

    setEintraege((prev) => [eintrag, ...prev]);
    setSekunden(0);
    startZeitRef.current = null;
  }

  const gesamtSekunden = eintraege.reduce((sum, e) => sum + e.dauerSekunden, 0);

  return (
    <View style={styles.container}>
      {/* Aufgaben-Picker */}
      <Pressable
        style={[styles.picker, laeuft && styles.pickerDisabled]}
        onPress={() => !laeuft && setPickerSichtbar(true)}
      >
        <Ionicons
          name={aktiveAufgabe ? 'layers' : 'layers-outline'}
          size={18}
          color={aktiveAufgabe ? '#4F6BFF' : '#9CA3AF'}
        />
        <Text style={[styles.pickerText, aktiveAufgabe && styles.pickerTextAktiv]} numberOfLines={1}>
          {aktiveAufgabe ? aktiveAufgabe.titel : 'Aufgabe wählen …'}
        </Text>
        {!laeuft && <Ionicons name="chevron-down" size={16} color="#9CA3AF" />}
      </Pressable>

      {/* Timer-Anzeige */}
      <View style={styles.timerBereich}>
        {aktiveAufgabe?.projekt ? (
          <Text style={styles.projektLabel}>{aktiveAufgabe.projekt}</Text>
        ) : null}
        <Text style={[styles.timerAnzeige, laeuft && styles.timerAnzeigeAktiv]}>
          {formatZeit(sekunden)}
        </Text>
        {laeuft && (
          <View style={styles.liveIndikator}>
            <View style={styles.liveKreis} />
            <Text style={styles.liveText}>läuft</Text>
          </View>
        )}
      </View>

      {/* Start / Stop */}
      <Pressable
        style={({ pressed }) => [
          styles.startButton,
          laeuft ? styles.stopButton : styles.startButtonInaktiv,
          pressed && styles.startButtonPressed,
          !aktiveAufgabe && !laeuft && styles.startButtonDisabled,
        ]}
        onPress={laeuft ? handleStop : handleStart}
      >
        <Ionicons
          name={laeuft ? 'stop' : 'play'}
          size={32}
          color="#fff"
        />
        <Text style={styles.startButtonText}>{laeuft ? 'Stopp' : 'Start'}</Text>
      </Pressable>

      {/* Heutige Einträge */}
      <View style={styles.eintraegeBereich}>
        <View style={styles.eintraegeHeader}>
          <Text style={styles.eintraegeHeaderTitel}>Heute</Text>
          {gesamtSekunden > 0 && (
            <Text style={styles.eintraegeHeaderGesamt}>
              {formatDauer(gesamtSekunden)} gesamt
            </Text>
          )}
        </View>

        <FlatList
          data={eintraege}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.eintragCard}>
              <View style={styles.eintragLinks}>
                <Text style={styles.eintragTitel} numberOfLines={1}>{item.aufgabeTitel}</Text>
                {item.aufgabeProjekt ? (
                  <Text style={styles.eintragProjekt} numberOfLines={1}>{item.aufgabeProjekt}</Text>
                ) : null}
              </View>
              <View style={styles.eintragRechts}>
                <Text style={styles.eintragDauer}>{formatDauer(item.dauerSekunden)}</Text>
                <Text style={styles.eintragZeit}>
                  {formatUhrzeit(item.startzeit)} – {formatUhrzeit(item.endzeit)}
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.leer}>
              <Ionicons name="timer-outline" size={40} color="#D1D5DB" />
              <Text style={styles.leerText}>Noch keine Einträge heute</Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <AufgabePickerModal
        visible={pickerSichtbar}
        aufgaben={aufgaben}
        ausgewaehlt={aktiveAufgabe}
        onAuswaehlen={setAktiveAufgabe}
        onClose={() => setPickerSichtbar(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  pickerDisabled: {
    opacity: 0.6,
  },
  pickerText: {
    flex: 1,
    fontSize: 15,
    color: '#9CA3AF',
  },
  pickerTextAktiv: {
    color: '#111827',
    fontWeight: '500',
  },
  timerBereich: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 10,
  },
  projektLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4F6BFF',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  timerAnzeige: {
    fontSize: 64,
    fontWeight: '200',
    color: '#374151',
    letterSpacing: 4,
    fontVariant: ['tabular-nums'],
  },
  timerAnzeigeAktiv: {
    color: '#111827',
    fontWeight: '300',
  },
  liveIndikator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveKreis: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  liveText: {
    fontSize: 13,
    color: '#22C55E',
    fontWeight: '600',
  },
  startButton: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: 160,
    paddingVertical: 18,
    borderRadius: 50,
    gap: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  startButtonInaktiv: {
    backgroundColor: '#4F6BFF',
    shadowColor: '#4F6BFF',
  },
  stopButton: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
  },
  startButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  startButtonDisabled: {
    backgroundColor: '#C7D0FF',
    shadowColor: 'transparent',
    elevation: 0,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  eintraegeBereich: {
    flex: 1,
    marginTop: 32,
  },
  eintraegeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  eintraegeHeaderTitel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  eintraegeHeaderGesamt: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4F6BFF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    flexGrow: 1,
  },
  eintragCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  eintragLinks: {
    flex: 1,
    gap: 2,
  },
  eintragTitel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  eintragProjekt: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  eintragRechts: {
    alignItems: 'flex-end',
    gap: 2,
  },
  eintragDauer: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4F6BFF',
  },
  eintragZeit: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  leer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 10,
  },
  leerText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});
