import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

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
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    if (!visible) {
      setTitel('');
      setProjekt('');
      setDauer(30);
      setDeadline('');
    }
  }, [visible]);

  if (!visible) return null;

  function handleSave() {
    if (!titel.trim()) return;
    onSave({
      titel: titel.trim(),
      projekt: projekt.trim() || undefined,
      geschaetzteDauer: dauer,
      deadline: deadline || undefined,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Sheet */}
      <div className="relative bg-white rounded-t-3xl max-h-[92vh] flex flex-col">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3">
          <h2 className="text-lg font-bold text-gray-900">Neue Aufgabe</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl text-gray-400 hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        {/* Formular */}
        <div className="overflow-y-auto flex-1 px-6 pb-4 space-y-4">
          {/* Titel */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Titel <span className="text-brand">*</span>
            </label>
            <input
              type="text"
              autoFocus
              placeholder="Was muss erledigt werden?"
              value={titel}
              onChange={(e) => setTitel(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>

          {/* Projekt */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Projekt</label>
            <input
              type="text"
              placeholder="z. B. FocusStack"
              value={projekt}
              onChange={(e) => setProjekt(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>

          {/* Dauer-Chips */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">
              Geschätzte Dauer
            </label>
            <div className="flex flex-wrap gap-2">
              {DAUER_OPTIONEN.map((min) => (
                <button
                  key={min}
                  onClick={() => setDauer(min)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold border-2 transition-colors ${
                    dauer === min
                      ? 'bg-brand-light border-brand text-brand'
                      : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {min < 60 ? `${min} min` : `${min / 60} h`}
                </button>
              ))}
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Deadline <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="date"
              value={deadline}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="px-6 pb-safe pt-3 flex gap-3 border-t border-gray-100">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            disabled={!titel.trim()}
            className={`flex-[2] py-3.5 rounded-xl text-white text-sm font-bold transition-colors ${
              titel.trim() ? 'bg-brand' : 'bg-brand-muted cursor-not-allowed'
            }`}
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
}
