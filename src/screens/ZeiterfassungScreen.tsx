import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Play, Square, Timer } from 'lucide-react';
import AufgabePickerModal from '../components/AufgabePickerModal';
import { ladeAufgaben, ladeHeutigeZeiteintraege, speichereZeiteintrag } from '../storage';
import { Aufgabe, Zeiteintrag } from '../types';

function formatZeit(sek: number): string {
  const h = Math.floor(sek / 3600);
  const m = Math.floor((sek % 3600) / 60);
  const s = sek % 60;
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
}

function formatDauer(sek: number): string {
  if (sek < 60) return `${sek} Sek.`;
  const m = Math.floor(sek / 60);
  if (m < 60) return `${m} Min.`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return rest > 0 ? `${h} h ${rest} Min.` : `${h} h`;
}

function formatUhrzeit(iso: string): string {
  return new Date(iso).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

export default function ZeiterfassungScreen() {
  const [aufgaben] = useState<Aufgabe[]>(ladeAufgaben);
  const [aktiveAufgabe, setAktiveAufgabe] = useState<Aufgabe | null>(null);
  const [laeuft, setLaeuft] = useState(false);
  const [sekunden, setSekunden] = useState(0);
  const [eintraege, setEintraege] = useState<Zeiteintrag[]>(ladeHeutigeZeiteintraege);
  const [pickerOffen, setPickerOffen] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startZeitRef = useRef<Date | null>(null);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  function handleStart() {
    if (!aktiveAufgabe) { setPickerOffen(true); return; }
    startZeitRef.current = new Date();
    setSekunden(0);
    intervalRef.current = setInterval(() => setSekunden((s) => s + 1), 1000);
    setLaeuft(true);
  }

  function handleStop() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setLaeuft(false);
    if (!aktiveAufgabe || !startZeitRef.current) return;

    const endzeit = new Date();
    const dauerSekunden = Math.round((endzeit.getTime() - startZeitRef.current.getTime()) / 1000);
    const eintrag = speichereZeiteintrag({
      aufgabeId: aktiveAufgabe.id,
      aufgabeTitel: aktiveAufgabe.titel,
      aufgabeProjekt: aktiveAufgabe.projekt,
      startzeit: startZeitRef.current.toISOString(),
      endzeit: endzeit.toISOString(),
      dauerSekunden,
    });
    setEintraege((prev) => [eintrag, ...prev]);
    setSekunden(0);
    startZeitRef.current = null;
  }

  const gesamtSekunden = eintraege.reduce((s, e) => s + e.dauerSekunden, 0);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Aufgaben-Picker */}
      <div className="px-4 pt-4">
        <button
          onClick={() => !laeuft && setPickerOffen(true)}
          disabled={laeuft}
          className={`w-full flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 shadow-sm text-left transition-opacity ${laeuft ? 'opacity-60' : ''}`}
        >
          <span className={`flex-1 text-sm font-medium truncate ${aktiveAufgabe ? 'text-gray-900' : 'text-gray-400'}`}>
            {aktiveAufgabe ? aktiveAufgabe.titel : 'Aufgabe wählen …'}
          </span>
          {aktiveAufgabe?.projekt && (
            <span className="text-xs font-semibold text-brand bg-brand-light px-2 py-0.5 rounded-md flex-shrink-0">
              {aktiveAufgabe.projekt}
            </span>
          )}
          {!laeuft && <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
        </button>
      </div>

      {/* Timer */}
      <div className="flex flex-col items-center py-10 gap-3">
        {aktiveAufgabe?.projekt && (
          <p className="text-xs font-bold text-brand uppercase tracking-widest">
            {aktiveAufgabe.projekt}
          </p>
        )}
        <p className={`tabular text-7xl font-thin tracking-widest ${laeuft ? 'text-gray-900' : 'text-gray-400'}`}>
          {formatZeit(sekunden)}
        </p>
        {laeuft && (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold text-green-500">läuft</span>
          </div>
        )}
      </div>

      {/* Start / Stop Button */}
      <div className="flex justify-center pb-8">
        <button
          onClick={laeuft ? handleStop : handleStart}
          className={`flex items-center gap-3 px-10 py-4 rounded-full text-white text-lg font-bold shadow-lg transition-all active:scale-95 ${
            laeuft
              ? 'bg-red-500 shadow-red-500/40'
              : aktiveAufgabe
              ? 'bg-brand shadow-brand/40'
              : 'bg-brand-muted shadow-none'
          }`}
        >
          {laeuft
            ? <><Square size={22} fill="white" /> Stopp</>
            : <><Play size={22} fill="white" /> Start</>}
        </button>
      </div>

      {/* Heutige Einträge */}
      <div className="flex-1 px-4 pb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-700">Heute</h2>
          {gesamtSekunden > 0 && (
            <span className="text-xs font-bold text-brand">{formatDauer(gesamtSekunden)} gesamt</span>
          )}
        </div>

        {eintraege.length === 0 ? (
          <div className="flex flex-col items-center py-10 gap-2 text-center">
            <Timer size={36} className="text-gray-200" />
            <p className="text-sm text-gray-400">Noch keine Einträge heute</p>
          </div>
        ) : (
          <div className="space-y-2">
            {eintraege.map((e) => (
              <div key={e.id} className="bg-white rounded-2xl px-4 py-3 shadow-sm flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{e.aufgabeTitel}</p>
                  <p className="text-xs text-gray-400">
                    {formatUhrzeit(e.startzeit)} – {formatUhrzeit(e.endzeit)}
                    {e.aufgabeProjekt && ` · ${e.aufgabeProjekt}`}
                  </p>
                </div>
                <span className="text-sm font-bold text-brand">{formatDauer(e.dauerSekunden)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <AufgabePickerModal
        visible={pickerOffen}
        aufgaben={aufgaben}
        ausgewaehlt={aktiveAufgabe}
        onAuswaehlen={setAktiveAufgabe}
        onClose={() => setPickerOffen(false)}
      />
    </div>
  );
}
