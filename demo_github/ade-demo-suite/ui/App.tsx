// ADE Demo UI - Minimal Console + Observer wired to backend
import React, { useState, useEffect } from 'react';
type ConsoleResult = {
  output: string;
  success: boolean;
};
type ConsoleHistoryItem = {
  ts: string;
  kind: string;
  payload: Record<string, any>;
};
type ObservationEvent = {
  ts: string;
  source: string;
  kind: string;
  payload: Record<string, any>;
};
type Suggestion = {
  id: string;
  title: string;
  description: string;
  action_hint: string;
};
const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'console' | 'observer'>('console');
  // Console state
  const [command, setCommand] = useState('');
  const [args, setArgs] = useState('');
  const [consoleOutput, setConsoleOutput] = useState<ConsoleResult | null>(null);
  const [consoleHistory, setConsoleHistory] = useState<ConsoleHistoryItem[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [consoleError, setConsoleError] = useState<string | null>(null);
  // Observer state
  const [events, setEvents] = useState<ObservationEvent[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [observerError, setObserverError] = useState<string | null>(null);
  const [isLoadingObserver, setIsLoadingObserver] = useState(false);
  // Backend base path (FastAPI mounts routers under /api/...)
  const backendBase = '/api';
  const fetchConsoleHistory = async () => {
    try {
      setConsoleError(null);
      const res = await fetch(`${backendBase}/console/history`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      setConsoleHistory(Array.isArray(data.history) ? data.history : []);
    } catch (err: any) {
      setConsoleError(`Errore history console: ${err.message || String(err)}`);
    }
  };
  const runCommand = async () => {
    if (!command.trim()) return;
    setIsRunning(true);
    setConsoleError(null);
    setConsoleOutput(null);
    try {
      const payload = {
        command: command.trim(),
        args: args.trim() ? args.trim().split(/\s+/) : null,
      };
      const res = await fetch(`${backendBase}/console/exec`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data: ConsoleResult = await res.json();
      setConsoleOutput(data);
      await fetchConsoleHistory();
    } catch (err: any) {
      setConsoleError(`Errore esecuzione comando: ${err.message || String(err)}`);
    } finally {
      setIsRunning(false);
    }
  };
  const loadObserverData = async () => {
    setIsLoadingObserver(true);
    setObserverError(null);
    try {
      const [eventsRes, suggestRes] = await Promise.all([
        fetch(`${backendBase}/observer/events?limit=20`),
        fetch(`${backendBase}/observer/suggest`),
      ]);
      if (!eventsRes.ok) {
        throw new Error(`Events HTTP ${eventsRes.status}`);
      }
      if (!suggestRes.ok) {
        throw new Error(`Suggest HTTP ${suggestRes.status}`);
      }
      const eventsData = await eventsRes.json();
      const suggestData = await suggestRes.json();
      setEvents(Array.isArray(eventsData) ? eventsData : []);
      setSuggestions(Array.isArray(suggestData.suggestions) ? suggestData.suggestions : []);
    } catch (err: any) {
      setObserverError(`Errore observer: ${err.message || String(err)}`);
    } finally {
      setIsLoadingObserver(false);
    }
  };
  useEffect(() => {
    if (activeTab === 'console') {
      fetchConsoleHistory();
    } else if (activeTab === 'observer') {
      loadObserverData();
    }
  }, [activeTab]);
  const renderConsoleTab = () => (
    <div className="console-tab">
      <div className="console-input-row">
        <input
          type="text"
          placeholder="Comando (es. ade-state)"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
        />
        <input
          type="text"
          placeholder="Args (separati da spazio)"
          value={args}
          onChange={(e) => setArgs(e.target.value)}
        />
        <button onClick={runCommand} disabled={isRunning}>
          {isRunning ? 'Esecuzione...' : 'Esegui'}
        </button>
      </div>
      {consoleError && <div className="error-box">{consoleError}</div>}
      <div className="console-output">
        <h3>Output</h3>
        {consoleOutput ? (
          <pre className={consoleOutput.success ? 'ok' : 'fail'}>
            {consoleOutput.output}
          </pre>
        ) : (
          <div className="placeholder">Nessun output ancora. Esegui un comando.</div>
        )}
      </div>
      <div className="console-history">
        <h3>History</h3>
        {consoleHistory.length === 0 ? (
          <div className="placeholder">Nessuna history disponibile.</div>
        ) : (
          <ul>
            {consoleHistory.map((item, idx) => (
              <li key={idx}>
                <span className="ts">{item.ts}</span>{' '}
                <span className="kind">{item.kind}</span>{' '}
                <code>{JSON.stringify(item.payload)}</code>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
  const renderObserverTab = () => (
    <div className="observer-tab">
      <div className="observer-header">
        <button onClick={loadObserverData} disabled={isLoadingObserver}>
          {isLoadingObserver ? 'Aggiornamento...' : 'Aggiorna'}
        </button>
      </div>
      {observerError && <div className="error-box">{observerError}</div>}
      <div className="observer-section">
        <h3>Eventi</h3>
        {events.length === 0 ? (
          <div className="placeholder">Nessun evento.</div>
        ) : (
          <ul>
            {events.map((ev, idx) => (
              <li key={idx}>
                <span className="ts">{ev.ts}</span>{' '}
                <span className="source">{ev.source}</span>{' '}
                <span className="kind">{ev.kind}</span>{' '}
                <code>{JSON.stringify(ev.payload)}</code>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="observer-section">
        <h3>Suggerimenti</h3>
        {suggestions.length === 0 ? (
          <div className="placeholder">Nessun suggerimento.</div>
        ) : (
          <ul>
            {suggestions.map((sug) => (
              <li key={sug.id}>
                <div className="suggest-title">{sug.title}</div>
                <div className="suggest-desc">{sug.description}</div>
                <div className="suggest-action">Hint: {sug.action_hint}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
  return (
    <div className="console-container">
      <header>
        <h1>ADE DEMO CONSOLE</h1>
        <nav className="tabs">
          <button
            className={activeTab === 'console' ? 'active' : ''}
            onClick={() => setActiveTab('console')}
          >
            Console
          </button>
          <button
            className={activeTab === 'observer' ? 'active' : ''}
            onClick={() => setActiveTab('observer')}
          >
            Observer
          </button>
        </nav>
      </header>
      <main>
        {activeTab === 'console' ? renderConsoleTab() : renderObserverTab()}
      </main>
    </div>
  );
};
export default App;