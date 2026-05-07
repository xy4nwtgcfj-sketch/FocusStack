export type Aufgabe = {
  id: string;
  titel: string;
  projekt?: string;
  geschaetzteDauer: number; // Minuten
  deadline?: string;        // ISO-Datumsstring
  erledigt: boolean;
  erstelltAm: string;       // ISO-Datumsstring
};

export type Zeiteintrag = {
  id: string;
  aufgabeId: string;
  aufgabeTitel: string;
  aufgabeProjekt?: string;
  startzeit: string;
  endzeit: string;
  dauerSekunden: number;
};

export type KIPlan = {
  aufgaben: { titel: string; begruendung: string; dauer: number }[];
  gesamtdauer: number;
  motivation: string;
  erstelltAm: string;
};
