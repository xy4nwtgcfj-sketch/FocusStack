import { v4 as uuidv4 } from 'uuid';
import { Aufgabe, Zeiteintrag } from './types';

const AUFGABEN_KEY = 'focusstack/aufgaben';
const ZEIT_KEY = 'focusstack/zeiteintraege';

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

export function ladeAufgaben(): Aufgabe[] {
  return lese<Aufgabe>(AUFGABEN_KEY);
}

export function speichereAufgabe(
  daten: Omit<Aufgabe, 'id' | 'erledigt' | 'erstelltAm'>
): Aufgabe {
  const aufgaben = ladeAufgaben();
  const neu: Aufgabe = {
    ...daten,
    id: uuidv4(),
    erledigt: false,
    erstelltAm: new Date().toISOString(),
  };
  schreibe(AUFGABEN_KEY, [neu, ...aufgaben]);
  return neu;
}

export function aktualisiereAufgabe(
  id: string,
  aenderungen: Partial<Omit<Aufgabe, 'id' | 'erstelltAm'>>
): Aufgabe {
  const aufgaben = ladeAufgaben();
  const index = aufgaben.findIndex((a) => a.id === id);
  if (index === -1) throw new Error(`Aufgabe "${id}" nicht gefunden.`);
  const aktualisiert = { ...aufgaben[index], ...aenderungen };
  aufgaben[index] = aktualisiert;
  schreibe(AUFGABEN_KEY, aufgaben);
  return aktualisiert;
}

export function loescheAufgabe(id: string): void {
  schreibe(AUFGABEN_KEY, ladeAufgaben().filter((a) => a.id !== id));
}

// ─── Zeiteinträge ────────────────────────────────────────────────────────────

export function ladeZeiteintraege(): Zeiteintrag[] {
  return lese<Zeiteintrag>(ZEIT_KEY);
}

export function speichereZeiteintrag(daten: Omit<Zeiteintrag, 'id'>): Zeiteintrag {
  const alle = ladeZeiteintraege();
  const eintrag: Zeiteintrag = { ...daten, id: uuidv4() };
  schreibe(ZEIT_KEY, [eintrag, ...alle]);
  return eintrag;
}

export function ladeHeutigeZeiteintraege(): Zeiteintrag[] {
  const heute = new Date().toDateString();
  return ladeZeiteintraege().filter(
    (e) => new Date(e.startzeit).toDateString() === heute
  );
}
