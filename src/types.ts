export type Aufgabe = {
  id: string;
  titel: string;
  projekt?: string;
  geschaetzteDauer: number;
  deadline?: string;
  erledigt: boolean;
  erstelltAm: string;
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
