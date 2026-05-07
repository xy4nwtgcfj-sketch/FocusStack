import { ChevronDown, X } from 'lucide-react';
import { Aufgabe } from '../types';

type Props = {
  aufgaben: Aufgabe[];
  ausgewaehlt: Aufgabe | null;
  onAuswaehlen: (a: Aufgabe) => void;
  disabled?: boolean;
};

export default function AufgabePickerDropdown({ aufgaben, ausgewaehlt, onAuswaehlen, disabled }: Props) {
  const offene = aufgaben.filter((a) => !a.erledigt);

  return (
    <div className="relative">
      <div className={`flex items-center bg-white rounded-2xl px-4 py-3.5 shadow-sm gap-3 ${disabled ? 'opacity-60' : ''}`}>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-400 mb-0.5">Aufgabe</p>
          <select
            disabled={disabled}
            value={ausgewaehlt?.id ?? ''}
            onChange={(e) => {
              const a = offene.find((x) => x.id === e.target.value);
              if (a) onAuswaehlen(a);
            }}
            className="w-full bg-transparent text-sm font-semibold text-gray-900 focus:outline-none disabled:cursor-not-allowed appearance-none truncate"
          >
            <option value="">Aufgabe wählen …</option>
            {offene.map((a) => (
              <option key={a.id} value={a.id}>
                {a.titel}{a.projekt ? ` · ${a.projekt}` : ''}
              </option>
            ))}
          </select>
        </div>
        {!disabled && (
          ausgewaehlt
            ? <button onClick={() => onAuswaehlen(ausgewaehlt)} className="text-gray-300 hover:text-gray-500"><X size={16} /></button>
            : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
        )}
      </div>
    </div>
  );
}
