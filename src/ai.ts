import { Aufgabe, KIPlan } from './types';

const SYSTEM_PROMPT = `Du bist ein persönlicher Tagesplaner-Assistent für die App FocusStack.
Deine Aufgabe ist es, dem Nutzer zu helfen seinen Tag optimal zu strukturieren.

Du erhältst:
- Eine Liste offener Aufgaben mit Titel, Projekt, Deadline und geschätzter Dauer
- Das aktuelle Datum und die aktuelle Uhrzeit
- Die verfügbaren Arbeitsstunden des Nutzers heute

Deine Antwort MUSS ein valides JSON-Objekt sein – kein Text davor oder danach:
{
  "aufgaben": [
    {
      "titel": "Exakter Aufgabentitel wie in der Liste",
      "begruendung": "1-2 Sätze warum diese Aufgabe heute Priorität hat",
      "dauer": 30
    }
  ],
  "gesamtdauer": 120,
  "motivation": "Ein kurzer motivierender Satz auf Deutsch"
}

Regeln:
- Wähle 3–5 Aufgaben aus, maximal so viele wie in die verfügbare Zeit passen
- Priorisiere: Aufgaben mit nahender Deadline zuerst, dann nach Wichtigkeit
- Überschreite die verfügbare Zeit nicht
- Antworte immer auf Deutsch
- Nur JSON zurückgeben, absolut kein Text außerhalb des JSON`;

export type KIFehler = { typ: 'api_key' | 'netzwerk' | 'keine_aufgaben' | 'unbekannt'; nachricht: string };

export async function getTagesplanung(
  aufgaben: Aufgabe[],
  stundenHeute: number,
  apiKey: string
): Promise<KIPlan> {
  if (!apiKey.trim()) {
    throw { typ: 'api_key', nachricht: 'Kein API-Key eingegeben.' } satisfies KIFehler;
  }

  const offeneAufgaben = aufgaben.filter((a) => !a.erledigt);
  if (offeneAufgaben.length === 0) {
    throw { typ: 'keine_aufgaben', nachricht: 'Keine offenen Aufgaben vorhanden.' } satisfies KIFehler;
  }

  const jetzt = new Date();
  const datumText = jetzt.toLocaleDateString('de-DE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const uhrzeitText = jetzt.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

  const aufgabenText = offeneAufgaben
    .map((a) => {
      const deadline = a.deadline
        ? `Deadline: ${new Date(a.deadline).toLocaleDateString('de-DE')}`
        : 'Keine Deadline';
      return `- "${a.titel}"${a.projekt ? ` [${a.projekt}]` : ''} | ${a.geschaetzteDauer} Min. | ${deadline}`;
    })
    .join('\n');

  const userMessage = `Datum: ${datumText}, ${uhrzeitText}
Verfügbare Zeit heute: ${stundenHeute} Stunden (${stundenHeute * 60} Minuten)

Offene Aufgaben:
${aufgabenText}

Erstelle meinen optimalen Tagesplan für heute.`;

  let response: Response;
  try {
    response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });
  } catch {
    throw { typ: 'netzwerk', nachricht: 'Keine Verbindung zur KI. Bitte Internetverbindung prüfen.' } satisfies KIFehler;
  }

  if (!response.ok) {
    const status = response.status;
    if (status === 401) throw { typ: 'api_key', nachricht: 'Ungültiger API-Key. Bitte prüfen.' } satisfies KIFehler;
    throw { typ: 'unbekannt', nachricht: `API-Fehler ${status}. Bitte später erneut versuchen.` } satisfies KIFehler;
  }

  const json = await response.json() as { content: { type: string; text: string }[] };
  const text = json.content.find((c) => c.type === 'text')?.text ?? '';

  try {
    const plan = JSON.parse(text) as KIPlan;
    return { ...plan, erstelltAm: new Date().toISOString() };
  } catch {
    throw { typ: 'unbekannt', nachricht: 'Ungültige Antwort von der KI erhalten.' } satisfies KIFehler;
  }
}
