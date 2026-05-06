import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { Aufgabe } from './types';

const STORAGE_KEY = '@focusstack/aufgaben';

export async function ladeAufgaben(): Promise<Aufgabe[]> {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  return json ? (JSON.parse(json) as Aufgabe[]) : [];
}

export async function speichereAufgabe(
  daten: Omit<Aufgabe, 'id' | 'erledigt' | 'erstelltAm'>
): Promise<Aufgabe> {
  const aufgaben = await ladeAufgaben();
  const neueAufgabe: Aufgabe = {
    ...daten,
    id: uuidv4(),
    erledigt: false,
    erstelltAm: new Date().toISOString(),
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...aufgaben, neueAufgabe]));
  return neueAufgabe;
}

export async function aktualisiereAufgabe(
  id: string,
  aenderungen: Partial<Omit<Aufgabe, 'id' | 'erstelltAm'>>
): Promise<Aufgabe> {
  const aufgaben = await ladeAufgaben();
  const index = aufgaben.findIndex((a) => a.id === id);
  if (index === -1) throw new Error(`Aufgabe mit ID "${id}" nicht gefunden.`);
  const aktualisiert = { ...aufgaben[index], ...aenderungen };
  aufgaben[index] = aktualisiert;
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(aufgaben));
  return aktualisiert;
}

export async function loescheAufgabe(id: string): Promise<void> {
  const aufgaben = await ladeAufgaben();
  const gefiltert = aufgaben.filter((a) => a.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(gefiltert));
}

export async function loescheAlleAufgaben(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
