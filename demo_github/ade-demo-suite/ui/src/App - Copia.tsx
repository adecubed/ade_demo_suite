// ADE Demo UI - Console + Observer + Forge + Memory (allineata backend 8001)
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
type ForgePlanStatus = {
  plan_id: string;
  status: string;
  steps?: any[];
};
type MemoryItem = {
  key: string;
  content: string;
  tags: string[];
  ts: string;
};
type TabId = 'console' | 'observer' | 'forge' | 'memory';
const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('console');
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
  // Forge demo state
  const [forgePlanName, setForgePlanName] = useState('demo_plan');
  const [forgeGoal, setForgeGoal] = useState('Mostra un piano demo Forge');
  const [forgeStatus, setForgeStatus] = useState<ForgePlanStatus | null>(null);
  const [forgeError, setForgeError] = useState<string | null>(null);
  const [isForgeBusy, setIsForgeBusy] = useState(false);
  // Memory demo state
  const [memoryKey, setMemoryKey] = useState('');
  const [memoryContent, setMemoryContent] = useState('');
  const [memoryTags, setMemoryTags] = useState('');
  const [memoryQuery, setMemoryQuery] = useState('');
  const [memoryItems, setMemoryItems] = useState<MemoryItem[]>([]);
  const [memoryError, setMemoryError] = useState<string | null>(null);
  const [isMemoryBusy, setIsMemoryBusy] = useState(false);
  // Backend base path: FastAPI demo backend su 8001
  const backendBase = 'http://127.0.0.1:8001/api';
  const fetchConsoleHistory = async () => {
    try {
      setConsoleError(null);
      const res = await fetch(`${backendBase}/console/history`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      // backend/endpoints/console.py ritorna {"history": [...]}
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
        args: args.trim() ? args.trim().split(/\s+/) : [],
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
      setSuggestions(
        Array.isArray(suggestData.suggestions) ? suggestData.suggestions : [],
      );
    } catch (err: any) {
      setObserverError(`Errore observer: ${err.message || String(err)}`);
    } finally {
      setIsLoadingObserver(false);
    }
  };
  const createForgePlan = async () => {
    if (!forgePlanName.trim() || !forgeGoal.trim()) {
      setForgeError('Plan name e goal sono obbligatori.');
      return;
    }
    setIsForgeBusy(true);
    setForgeError(null);
    setForgeStatus(null);
    try {
      const payload = { name: forgePlanName.trim(), goal: forgeGoal.trim() };
      const res = await fetch(`${backendBase}/forge/plan/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data: ForgePlanStatus = await res.json();
      setForgeStatus(data);
    } catch (err: any) {
      setForgeError(`Errore creazione piano: ${err.message || String(err)}`);
    } finally {
      setIsForgeBusy(false);
    }
  };
  const runForgePlan = async () => {
    const planId = forgeStatus?.plan_id || forgePlanName.trim();
    if (!planId) {
      setForgeError('Plan id è obbligatorio per eseguire il piano.');
      return;
    }
    setIsForgeBusy(true);
    setForgeError(null);
    try {
      const params = new URLSearchParams({ plan_id: planId });
      const res = await fetch(
        `${backendBase}/forge/plan/run?${params.toString()}`,
        {
          method: 'POST',
        },
      );
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data: ForgePlanStatus = await res.json();
      setForgeStatus(data);
    } catch (err: any) {
      setForgeError(`Errore esecuzione piano: ${err.message || String(err)}`);
    } finally {
      setIsForgeBusy(false);
    }
  };
  const putMemoryItem = async () => {
    if (!memoryKey.trim() || !memoryContent.trim()) {
      setMemoryError('Key e content sono obbligatori.');
      return;
    }
    setIsMemoryBusy(true);
    setMemoryError(null);
    try {
      const tags = memoryTags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      const payload = {
        key: memoryKey.trim(),
        content: memoryContent.trim(),
        tags,
      };
      const res = await fetch(`${backendBase}/memory/put`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      await res.json();
      setMemoryKey('');
      setMemoryContent('');
      setMemoryTags('');
    } catch (err: any) {
      setMemoryError(`Errore salvataggio memoria: ${err.message || String(err)}`);
    } finally {
      setIsMemoryBusy(false);
    }
  };
  const queryMemory = async () => {
    setIsMemoryBusy(true);
    setMemoryError(null);
    try {
      const payload = {
        query: memoryQuery.trim(),
        limit: 20,
      };
      const res = await fetch(`${backendBase}/memory/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      setMemoryItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setMemoryError(`Errore query memoria: ${err.message || String(err)}`);
    } finally {
      setIsMemoryBusy(false);
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
          <div className="placeholder">
            Nessun output ancora. Esegui un comando.
          </div>
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
          {isLoadingObserver ? 'Aggiornamento...' : 'Ricarica dati observer'}
        </button>
        {observerError && <div className="error-box">{observerError}</div>}
      </div>
      <div className="observer-content">
        <div className="observer-events observer-section">
          <h3>Eventi</h3>
          {events.length === 0 ? (
            <div className="placeholder">Nessun evento disponibile.</div>
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
        <div className="observer-suggestions observer-section">
          <h3>Suggerimenti</h3>
          {suggestions.length === 0 ? (
            <div className="placeholder">Nessun suggerimento disponibile.</div>
          ) : (
            <ul>
              {suggestions.map((sug) => (
                <li key={sug.id}>
                  <div className="suggest-title">{sug.title}</div>
                  <div className="suggest-desc">{sug.description}</div>
                  <div className="suggest-action">{sug.action_hint}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
  const renderForgeTab = () => (
    <div className="forge-tab">
      <div className="forge-form">
        <div className="field-row">
          <label>Nome piano</label>
          <input
            type="text"
            placeholder="Nome piano"
            value={forgePlanName}
            onChange={(e) => setForgePlanName(e.target.value)}
          />
        </div>
        <div className="field-row">
          <label>Goal del piano</label>
          <input
            type="text"
            placeholder="Goal del piano"
            value={forgeGoal}
            onChange={(e) => setForgeGoal(e.target.value)}
          />
        </div>
        <div className="forge-buttons">
          <button onClick={createForgePlan} disabled={isForgeBusy}>
            {isForgeBusy ? 'Creazione...' : 'Crea piano'}
          </button>
          <button onClick={runForgePlan} disabled={isForgeBusy}>
            {isForgeBusy ? 'Esecuzione...' : 'Esegui piano'}
          </button>
        </div>
      </div>
      {forgeError && <div className="error-box">{forgeError}</div>}
      <div className="forge-status">
        <h3>Stato piano Forge</h3>
        {forgeStatus ? (
          <pre className="ok">{JSON.stringify(forgeStatus, null, 2)}</pre>
        ) : (
          <div className="placeholder">
            Nessun piano ancora creato o eseguito.
          </div>
        )}
      </div>
    </div>
  );
  const renderMemoryTab = () => (
    <div className="memory-tab">
      <div className="memory-write">
        <h3>Scrivi memoria</h3>
        <div className="field-row">
          <label>Key</label>
          <input
            type="text"
            placeholder="Key"
            value={memoryKey}
            onChange={(e) => setMemoryKey(e.target.value)}
          />
        </div>
        <div className="field-row">
          <label>Content</label>
          <textarea
            placeholder="Content"
            value={memoryContent}
            onChange={(e) => setMemoryContent(e.target.value)}
          />
        </div>
        <div className="field-row">
          <label>Tags (separate da virgola)</label>
          <input
            type="text"
            placeholder="Tags (separate da virgola)"
            value={memoryTags}
            onChange={(e) => setMemoryTags(e.target.value)}
          />
        </div>
        <button onClick={putMemoryItem} disabled={isMemoryBusy}>
          {isMemoryBusy ? 'Salvataggio...' : 'Salva'}
        </button>
      </div>
      <div className="memory-query">
        <h3>Cerca memoria</h3>
        <div className="field-row">
          <label>Query</label>
          <input
            type="text"
            placeholder="Query"
            value={memoryQuery}
            onChange={(e) => setMemoryQuery(e.target.value)}
          />
        </div>
        <button onClick={queryMemory} disabled={isMemoryBusy}>
          {isMemoryBusy ? 'Ricerca...' : 'Cerca'}
        </button>
        {memoryError && <div className="error-box">{memoryError}</div>}
      </div>
      <div className="memory-results">
        <h3>Risultati</h3>
        {memoryItems.length === 0 ? (
          <div className="placeholder">Nessun risultato.</div>
        ) : (
          <ul>
            {memoryItems.map((item, idx) => (
              <li key={idx}>
                <div className="memory-key">{item.key}</div>
                <div className="memory-content">{item.content}</div>
                <div className="memory-tags">
                  Tags: {item.tags && item.tags.length > 0 ? item.tags.join(', ') : '—'}
                </div>
                <div className="memory-ts">TS: {item.ts}</div>
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
            className={`tab-button tab-console ${activeTab === 'console' ? 'active' : ''}`}
            onClick={() => setActiveTab('console')}
          >
            Console
          </button>
          <button
            className={`tab-button ${activeTab === 'observer' ? 'active' : ''}`}
            onClick={() => setActiveTab('observer')}
          >
            Observer
          </button>
          <button
            className={`tab-button ${activeTab === 'forge' ? 'active' : ''}`}
            onClick={() => setActiveTab('forge')}
          >
            Forge
          </button>
          <button
            className={`tab-button ${activeTab === 'memory' ? 'active' : ''}`}
            onClick={() => setActiveTab('memory')}
          >
            Memory
          </button>
        </nav>
      </header>
      <main>
        {activeTab === 'console' && renderConsoleTab()}
        {activeTab === 'observer' && renderObserverTab()}
        {activeTab === 'forge' && renderForgeTab()}
        {activeTab === 'memory' && renderMemoryTab()}
      </main>
    </div>
  );
};
export default App;