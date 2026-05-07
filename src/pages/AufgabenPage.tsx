import { useState } from 'react';
import { Plus, CheckCircle2 } from 'lucide-react';
import AufgabeItem from '../components/AufgabeItem';
import AufgabeFormModal, { AufgabeFormData } from '../components/AufgabeFormModal';
import { aktualisiereAufgabe, ladeAufgaben, speichereAufgabe } from '../storage';
import { Aufgabe } from '../types';

export default function AufgabenPage() {
  const [aufgaben, setAufgaben] = useState<Aufgabe[]>(ladeAufgaben);
  const [modalOffen, setModalOffen] = useState(false);

  function handleToggle(id: string) {
    const a = aufgaben.find((x) => x.id === id);
    if (!a) return;
    const aktualisiert = aktualisiereAufgabe(id, { erledigt: !a.erledigt });
    setAufgaben((prev) => prev.map((x) => (x.id === id ? aktualisiert : x)));
  }

  function handleSave(data: AufgabeFormData) {
    const neu = speichereAufgabe(data);
    setAufgaben((prev) => [neu, ...prev]);
  }

  const offene = aufgaben.filter((a) => !a.erledigt);
  const erledigte = aufgaben.filter((a) => a.erledigt);

  return (
    <div className="relative flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">

        {aufgaben.length > 0 && (
          <p className="text-xs font-medium text-gray-400 px-1">
            {offene.length} offen · {erledigte.length} erledigt
          </p>
        )}

        {offene.length > 0 && (
          <div className="space-y-2">
            {offene.map((a) => <AufgabeItem key={a.id} aufgabe={a} onToggle={handleToggle} />)}
          </div>
        )}

        {erledigte.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-400 px-1 mb-2">Erledigt</p>
            <div className="space-y-2">
              {erledigte.map((a) => <AufgabeItem key={a.id} aufgabe={a} onToggle={handleToggle} />)}
            </div>
          </div>
        )}

        {aufgaben.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <CheckCircle2 size={32} className="text-gray-300" />
            </div>
            <p className="text-base font-bold text-gray-600">Noch keine Aufgaben</p>
            <p className="text-sm text-gray-400">Tippe auf + um deine erste Aufgabe hinzuzufügen.</p>
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setModalOffen(true)}
        className="absolute bottom-6 right-5 w-14 h-14 rounded-full bg-brand flex items-center justify-center shadow-lg shadow-brand/40 active:scale-95 transition-transform"
      >
        <Plus size={28} strokeWidth={2.5} className="text-white" />
      </button>

      <AufgabeFormModal visible={modalOffen} onClose={() => setModalOffen(false)} onSave={handleSave} />
    </div>
  );
}
