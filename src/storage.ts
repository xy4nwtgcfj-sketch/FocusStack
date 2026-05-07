import { v4 as uuidv4 } from 'uuid';
import { Aufgabe, KIPlan, Zeiteintrag } from './types';

// ─── Hilfsfunktionen ─────────────────────────────────────────────────────────

function lese<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function schreibe<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// ─── Aufgaben ────────────────────────────────────────────────────────────────

const AUFGABEN_KEY = 'focusstack/aufgaben';

export function ladeAufgaben(): Aufgabe[] {
  return lese<Aufgabe>(AUFGABEN_KEY);
}

export function speichereAufgabe(
  daten: Omit<Aufgabe, 'id' | 'erledigt' | 'erstelltAm'>
): Aufgabe {
  const neu: Aufgabe = {
    ...daten,
    id: uuidv4(),
    erledigt: false,
    erstelltAm: new Date().toISOString(),
  };
  schreibe(AUFGABEN_KEY, [neu, ...ladeAufgaben()]);
  return neu;
}

export function aktualisiereAufgabe(
  id: string,
  aenderungen: Partial<Omit<Aufgabe, 'id' | 'erstelltAm'>>
): Aufgabe {
  const liste = ladeAufgaben();
  const idx = liste.findIndex((a) => a.id === id);
  if (idx === -1) throw new Error(`Aufgabe "${id}" nicht gefunden.`);
  const aktualisiert = { ...liste[idx], ...aenderungen };
  liste[idx] = aktualisiert;
  schreibe(AUFGABEN_KEY, liste);
  return aktualisiert;
}

export function loescheAufgabe(id: string): void {
  schreibe(AUFGABEN_KEY, ladeAufgaben().filter((a) => a.id !== id));
}

// ─── Zeiteinträge ────────────────────────────────────────────────────────────

const ZEIT_KEY = 'focusstack/zeiteintraege';

export function ladeZeiteintraege(): Zeiteintrag[] {
  return lese<Zeiteintrag>(ZEIT_KEY);
}

export function speichereZeiteintrag(daten: Omit<Zeiteintrag, 'id'>): Zeiteintrag {
  const eintrag: Zeiteintrag = { ...daten, id: uuidv4() };
  schreibe(ZEIT_KEY, [eintrag, ...ladeZeiteintraege()]);
  return eintrag;
}

export function ladeHeutigeZeiteintraege(): Zeiteintrag[] {
  const heute = new Date().toDateString();
  return ladeZeiteintraege().filter(
    (e) => new Date(e.startzeit).toDateString() === heute
  );
}

// ─── API-Key & KI-Plan ───────────────────────────────────────────────────────

const API_KEY_KEY = 'focusstack/apiKey';
const KI_PLAN_KEY = 'focusstack/kiPlan';

export function ladeApiKey(): string {
  return localStorage.getItem(API_KEY_KEY) ?? '';
}

export function speichereApiKey(key: string): void {
  localStorage.setItem(API_KEY_KEY, key);
}

export function ladeKIPlan(): KIPlan | null {
  try {
    const raw = localStorage.getItem(KI_PLAN_KEY);
    return raw ? (JSON.parse(raw) as KIPlan) : null;
  } catch {
    return null;
  }
}

export function speichereKIPlan(plan: KIPlan): void {
  localStorage.setItem(KI_PLAN_KEY, JSON.stringify(plan));
}
