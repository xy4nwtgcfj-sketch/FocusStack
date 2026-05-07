import { Check, X } from 'lucide-react';
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
  if (!visible) return null;

  const offene = aufgaben.filter((a) => !a.erledigt);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl max-h-[75vh] flex flex-col">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>
        <div className="flex items-center justify-between px-6 py-3">
          <h2 className="text-lg font-bold text-gray-900">Aufgabe wählen</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl text-gray-400 hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-4 pb-8">
          {offene.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-10">
              Keine offenen Aufgaben vorhanden.
            </p>
          ) : (
            <div className="space-y-1">
              {offene.map((aufgabe) => {
                const aktiv = ausgewaehlt?.id === aufgabe.id;
                return (
                  <button
                    key={aufgabe.id}
                    onClick={() => { onAuswaehlen(aufgabe); onClose(); }}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-colors ${
                      aktiv ? 'bg-brand-light' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${aktiv ? 'text-brand' : 'text-gray-900'}`}>
                        {aufgabe.titel}
                      </p>
                      {aufgabe.projekt && (
                        <p className="text-xs text-gray-400 truncate">{aufgabe.projekt}</p>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">{aufgabe.geschaetzteDauer} min</span>
                    {aktiv && <Check size={18} className="text-brand flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
