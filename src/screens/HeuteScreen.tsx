import { CheckCircle2, Clock, ListChecks } from 'lucide-react';
import { ladeAufgaben, ladeHeutigeZeiteintraege } from '../storage';

function formatDauer(sek: number): string {
  if (sek < 60) return `${sek} Sek.`;
  const m = Math.floor(sek / 60);
  if (m < 60) return `${m} Min.`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return rest > 0 ? `${h} h ${rest} Min.` : `${h} h`;
}

export default function HeuteScreen() {
  const aufgaben = ladeAufgaben();
  const eintraege = ladeHeutigeZeiteintraege();

  const offene = aufgaben.filter((a) => !a.erledigt).length;
  const erledigte = aufgaben.filter((a) => a.erledigt).length;
  const gesamtSekunden = eintraege.reduce((s, e) => s + e.dauerSekunden, 0);

  const wochentage = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  const heute = new Date();
  const datum = heute.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
  const wochentag = wochentage[heute.getDay()];

  return (
    <div className="p-4 space-y-4">
      {/* Datum */}
      <div className="pt-2 pb-1">
        <p className="text-xs font-semibold text-brand uppercase tracking-widest">{wochentag}</p>
        <p className="text-2xl font-bold text-gray-900">{datum}</p>
      </div>

      {/* Stat-Karten */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-2">
          <div className="w-9 h-9 rounded-xl bg-brand-light flex items-center justify-center">
            <ListChecks size={18} className="text-brand" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{offene}</p>
          <p className="text-xs text-gray-400 font-medium">Offen</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-2">
          <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
            <CheckCircle2 size={18} className="text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{erledigte}</p>
          <p className="text-xs text-gray-400 font-medium">Erledigt</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-2">
          <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
            <Clock size={18} className="text-violet-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {gesamtSekunden > 0 ? formatDauer(gesamtSekunden) : '–'}
          </p>
          <p className="text-xs text-gray-400 font-medium">Heute</p>
        </div>
      </div>

      {/* Heutige Zeiteinträge */}
      {eintraege.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-2 px-1">Zuletzt erfasst</h2>
          <div className="space-y-2">
            {eintraege.slice(0, 5).map((e) => (
              <div key={e.id} className="bg-white rounded-2xl px-4 py-3 shadow-sm flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{e.aufgabeTitel}</p>
                  {e.aufgabeProjekt && (
                    <p className="text-xs text-gray-400">{e.aufgabeProjekt}</p>
                  )}
                </div>
                <span className="text-sm font-bold text-brand">{formatDauer(e.dauerSekunden)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leerer Zustand */}
      {aufgaben.length === 0 && eintraege.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
          <div className="w-16 h-16 rounded-full bg-brand-light flex items-center justify-center">
            <ListChecks size={32} className="text-brand" />
          </div>
          <p className="text-lg font-bold text-gray-700">Willkommen bei FocusStack!</p>
          <p className="text-sm text-gray-400 max-w-xs">
            Lege deine erste Aufgabe an und starte mit der Zeiterfassung.
          </p>
        </div>
      )}
    </div>
  );
}
