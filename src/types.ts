export type Aufgabe = {
  id: string;
  titel: string;
  projekt?: string;
  geschaetzteDauer: number;
  deadline?: string;
  erledigt: boolean;
  erstelltAm: string;
};
