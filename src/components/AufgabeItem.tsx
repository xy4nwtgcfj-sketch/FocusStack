import { Check, Clock } from 'lucide-react';
import { Aufgabe } from '../types';

type Props = {
  aufgabe: Aufgabe;
  onToggle: (id: string) => void;
};

export default function AufgabeItem({ aufgabe, onToggle }: Props) {
  return (
    <div className="bg-white rounded-2xl px-4 py-3.5 shadow-sm flex items-center gap-3">
      <button
        onClick={() => onToggle(aufgabe.id)}
        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
          aufgabe.erledigt
            ? 'bg-brand border-brand'
            : 'border-gray-300 hover:border-brand'
        }`}
      >
        {aufgabe.erledigt && <Check size={13} strokeWidth={3} className="text-white" />}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold truncate ${aufgabe.erledigt ? 'line-through text-gray-400' : 'text-gray-900'}`}>
          {aufgabe.titel}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {aufgabe.projekt && (
            <span className="text-xs font-semibold text-brand bg-brand-light px-2 py-0.5 rounded-md">
              {aufgabe.projekt}
            </span>
          )}
          {aufgabe.deadline && (
            <span className="text-xs text-gray-400">
              bis {new Date(aufgabe.deadline).toLocaleDateString('de-DE', { day: '2-digit', month: 'short' })}
            </span>
          )}
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock size={11} /> {aufgabe.geschaetzteDauer} Min.
          </span>
        </div>
      </div>
    </div>
  );
}
