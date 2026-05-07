import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Loader2, Eye, EyeOff, Play, AlertCircle, Clock } from 'lucide-react';
import { getTagesplanung, KIFehler } from '../ai';
import {
  ladeApiKey, ladeAufgaben, ladeKIPlan,
  speichereApiKey, speichereKIPlan,
} from '../storage';
import { KIPlan } from '../types';

export default function HeutePage() {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState(ladeApiKey);
  const [keySichtbar, setKeySichtbar] = useState(false);
  const [stunden, setStunden] = useState(8);
  const [laedt, setLaedt] = useState(false);
  const [fehler, setFehler] = useState('');
  const [plan, setPlan] = useState<KIPlan | null>(ladeKIPlan);

  async function handlePlanErstellen() {
    setFehler('');
    setLaedt(true);
    speichereApiKey(apiKey);
    try {
      const aufgaben = ladeAufgaben();
      const neuerPlan = await getTagesplanung(aufgaben, stunden, apiKey);
      speichereKIPlan(neuerPlan);
      setPlan(neuerPlan);
    } catch (e) {
      const ki = e as KIFehler;
      setFehler(ki.nachricht ?? 'Unbekannter Fehler.');
    } finally {
      setLaedt(false);
    }
  }

  function handleTimerStarten(titel: string) {
    navigate('/zeiterfassung', { state: { aufgabeTitel: titel } });
  }

  const planDatum = plan?.erstelltAm
    ? new Date(plan.erstelltAm).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div className="p-4 space-y-4 pb-8">

      {/* API-Key */}
      <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
          <Sparkles size={16} className="text-brand" /> KI-Tagesplanung
        </h2>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Anthropic API-Key</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type={keySichtbar ? 'text' : 'password'}
                placeholder="sk-ant-…"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand pr-10"
              />
              <button
                onClick={() => setKeySichtbar((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {keySichtbar ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Key wird nur lokal gespeichert · <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" className="text-brand underline">console.anthropic.com</a>
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Verfügbare Stunden heute</label>
          <div className="flex gap-2">
            {[2, 4, 6, 8].map((h) => (
              <button
                key={h}
                onClick={() => setStunden(h)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border-2 transition-colors ${
                  stunden === h ? 'bg-brand-light border-brand text-brand' : 'bg-gray-50 border-gray-200 text-gray-500'
                }`}
              >
                {h} h
              </button>
            ))}
          </div>
        </div>

        {fehler && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
            <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-600">{fehler}</p>
          </div>
        )}

        <button
          onClick={handlePlanErstellen}
          disabled={laedt || !apiKey.trim()}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white text-sm font-bold transition-colors ${
            laedt || !apiKey.trim() ? 'bg-brand-muted cursor-not-allowed' : 'bg-brand active:opacity-80'
          }`}
        >
          {laedt
            ? <><Loader2 size={16} className="animate-spin" /> KI denkt nach …</>
            : <><Sparkles size={16} /> KI-Tagesplan erstellen</>}
        </button>
      </div>

      {/* KI-Plan */}
      {plan && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-gray-700">Dein Tagesplan</h2>
            {planDatum && <span className="text-xs text-gray-400">{planDatum}</span>}
          </div>

          {/* Motivation */}
          <div className="bg-brand rounded-2xl px-4 py-3.5">
            <p className="text-white text-sm font-medium leading-relaxed">💡 {plan.motivation}</p>
          </div>

          {/* Aufgaben */}
          <div className="space-y-2">
            {plan.aufgaben.map((a, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-brand-light text-brand text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-sm font-bold text-gray-900 truncate">{a.titel}</p>
                  </div>
                  <span className="text-xs text-gray-400 flex items-center gap-1 flex-shrink-0">
                    <Clock size={11} />{a.dauer} Min.
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mb-3 ml-8">{a.begruendung}</p>
                <div className="ml-8">
                  <button
                    onClick={() => handleTimerStarten(a.titel)}
                    className="flex items-center gap-1.5 bg-brand-light text-brand text-xs font-bold px-3 py-1.5 rounded-lg active:opacity-70"
                  >
                    <Play size={11} fill="currentColor" /> Timer starten
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Gesamtdauer */}
          <div className="bg-white rounded-2xl px-4 py-3 shadow-sm flex justify-between items-center">
            <span className="text-sm text-gray-500 font-medium">Gesamtdauer</span>
            <span className="text-sm font-bold text-brand">{plan.gesamtdauer} Min. ({Math.round(plan.gesamtdauer / 60 * 10) / 10} h)</span>
          </div>
        </div>
      )}

      {/* Leerzustand ohne Plan */}
      {!plan && !laedt && (
        <div className="flex flex-col items-center py-12 gap-3 text-center">
          <div className="w-16 h-16 rounded-full bg-brand-light flex items-center justify-center">
            <Sparkles size={28} className="text-brand" />
          </div>
          <p className="text-base font-bold text-gray-700">Noch kein Tagesplan</p>
          <p className="text-sm text-gray-400 max-w-xs">
            Gib deinen API-Key ein und lass Claude deinen optimalen Tag planen.
          </p>
        </div>
      )}
    </div>
  );
}
