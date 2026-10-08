# WIKIBLANK (Traccia 4.B)

Progetto per l'esame di Tecnologie Web.
Implementazione del gioco **WikiBlank**, ispirato all'impiccato, che utilizza l'API di Wikipedia per estrarre articoli casuali.

## Tecnologie Utilizzate
- **Backend**: Node.js, Express, TypeScript, Sequelize, SQLite, JWT (Autenticazione).
- **Frontend**: React (SPA), TypeScript, Vite, Tailwind CSS v4, Lucide React, Axios.
- **Testing**: Playwright (Test End-to-End).

---

## 1. Prerequisiti
Assicurarsi di avere installati sul proprio sistema:
- **Node.js** (versione 18 o superiore raccomandata, sviluppato su v20).
- **npm** (incluso in Node.js).

---

## 2. Avvio del Backend (Server)

Il backend espone le API REST e gestisce il database SQLite (che verrà creato automaticamente al primo avvio per garantire la persistenza dei dati).

1. Aprire un terminale e spostarsi nella cartella `backend`:
   ```bash
   cd backend
   ```
2. Installare le dipendenze:
   ```bash
   npm install
   ```
3. Avviare il server di sviluppo:
   ```bash
   npm run dev
   ```
Il server sarà ora in ascolto all'indirizzo `http://localhost:3000`.

---

## 3. Avvio del Frontend (Interfaccia Utente)

Il frontend è una Single Page Application (SPA) realizzata in React.

1. Aprire un **nuovo terminale** separato e spostarsi nella cartella `frontend`:
   ```bash
   cd frontend
   ```
2. Installare le dipendenze:
   ```bash
   npm install
   ```
3. Avviare l'applicazione in modalità sviluppo:
   ```bash
   npm run dev
   ```
Il frontend si avvierà su `http://localhost:5173`. Aprire questo link nel browser per giocare!

---

## 4. Esecuzione dei Test E2E (Playwright)

Per dimostrare i requisiti della traccia, sono stati implementati 12 test automatici End-to-End che verificano la registrazione, il login, lo svolgimento e l'abbandono di una partita.

1. Assicurarsi che **SIA IL BACKEND CHE IL FRONTEND** siano in esecuzione sui rispettivi terminali (porte 3000 e 5173).
2. Aprire un **terzo terminale** nella cartella principale del progetto (quella che contiene `backend` e `frontend`).
3. Installare i browser di playwright (solo la prima volta):
   ```bash
   npx playwright install
   ```
4. Eseguire i test:
   ```bash
   npx playwright test
   ```
Se si preferisce vedere l'interfaccia del browser mentre esegue i test:
   ```bash
   npx playwright test --ui
   ```
