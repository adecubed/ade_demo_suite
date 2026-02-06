// ADE Demo UI - Console + Observer + Forge + Memory + Chat (allineata backend 8001)
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
type TabId = 'chat' | 'console' | 'observer' | 'forge' | 'memory';
type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};
const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('chat');
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
  const [forgeGoal, setForgeGoal] = useState(' Show a demo Forge plan');
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
  // Guided Demo UI overlay state (PHASE 6)
  const [isDemoOverlayOpen, setIsDemoOverlayOpen] = useState(false);
  // Chat demo state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Welcome to the ADE Demo Chat.\nHere you can simulate the DevConsole chat: type a message and I will answer with a fake description of what ADE would do.',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatBusy, setIsChatBusy] = useState(false);
  const [isDemoChatRunning, setIsDemoChatRunning] = useState(false);
  // Backend base path: FastAPI demo backend su 8001
  const backendBase = 'http://127.0.0.1:8001/api';
  // Voiceover / narrativa per la Guided Demo (Scenario 1 — Observer workflow)
  const guidedDemoSteps = [
    {
      t: 0,
      speaker: 'narrator',
      text:
        'Imagine you are in the middle of a normal work session. Your main app is open and you are adjusting a setting that depends on a configuration file.',
    },
    {
      t: 5,
      speaker: 'narrator',
      text:
        'You change a value in config.yaml to tweak how the system behaves. It is a small change, but you know something needs to be restarted for it to take effect.',
    },
    {
      t: 10,
      speaker: 'narrator',
      text:
        'You switch to your tools and trigger a restart of the service. You have already done this several times today, and you will probably do it again.',
    },
    {
      t: 15,
      speaker: 'narrator',
      text:
        'What you see now is ADE’s Observer connecting these events: the edit to config.yaml, the focus on the tools, and the service restart.',
    },
    {
      t: 20,
      speaker: 'narrator',
      text:
        'After a few cycles, the Observer notices a repeating pattern. It is not reading your mind: it simply sees that you are repeating the same sequence of actions.',
    },
    {
      t: 25,
      speaker: 'narrator',
      text:
        'At this point ADE proposes a suggestion: turn this into a small automation, or at least make the flow safer and less fragile.',
    },
    {
      t: 30,
      speaker: 'narrator',
      text:
        'In this local demo the suggestion is predefined and deterministic. It is here to show the kind of help ADE can provide in real situations.',
    },
    {
      t: 35,
      speaker: 'narrator',
      text:
        'The goal is not to replace your work, but to reduce the noise: fewer manual repetitions, more focus on the decisions that really matter.',
    },
  ];
  const pushChatMessage = (msg: ChatMessage) => {
    setChatMessages((prev) => [...prev, msg]);
  };
  const sleep = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms));
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
      setConsoleError(
        `Command execution error: ${err.message || String(err)}`,
      );
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
        Array.isArray(suggestData.suggestions)
          ? suggestData.suggestions
          : [],
      );
    } catch (err: any) {
      setObserverError(`Errore observer: ${err.message || String(err)}`);
    } finally {
      setIsLoadingObserver(false);
    }
  };
  const createForgePlan = async () => {
    if (!forgePlanName.trim() || !forgeGoal.trim()) {
      setForgeError('Plan name e are required.');
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
      setForgeError(`Plan execution error: ${err.message || String(err)}`);
    } finally {
      setIsForgeBusy(false);
    }
  };
  const runForgePlan = async () => {
    const planId = forgeStatus?.plan_id || forgePlanName.trim();
    if (!planId) {
      setForgeError(' Plan id is required to run the plan.');
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
      setForgeError(
        `Plan execution error: ${err.message || String(err)}`,
      );
    } finally {
      setIsForgeBusy(false);
    }
  };
  const putMemoryItem = async () => {
    if (!memoryKey.trim() || !memoryContent.trim()) {
      setMemoryError('Key and content are required.');
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
      setMemoryError(
        ` Memory save error: ${err.message || String(err)}`,
      );
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
  const runDemoChatScript = async () => {
    if (isDemoChatRunning) return;
    setIsDemoChatRunning(true);
    setActiveTab('chat');
    // Step 1: user request
    pushChatMessage({
      role: 'user',
      content:
        'Hi ADE, I want to update the demo rules file. Can you change its content to "ADE rules the world"?',
    });
    await sleep(1200);
    // Step 2: assistant explains ADE rules and asks for read approval
    pushChatMessage({
      role: 'assistant',
      content:
        'Understood.\n\nAccording to ADE operational rules I cannot modify any file without first reading it and without your explicit approval.\n\nI propose the following first step:\n- Step 1: read the demo file `demo_rules.txt` (read-only, no changes).\n\nDo you want to authorize this step?\n[APPROVE] [REJECT] (simulated in this demo)',
    });
    await sleep(1500);
    // Step 3: user approves read
    pushChatMessage({
      role: 'user',
      content: 'Approve: I authorize reading the file demo_rules.txt.',
    });
    await sleep(1200);
    // Step 4: assistant shows current file content (simulated)
    pushChatMessage({
      role: 'assistant',
      content:
        'Ok, proceeding as required: first read, no modifications.\n\nSimulated current content of `demo_rules.txt`:\n```txt\nADE rules\n```\n\nNow I can propose the requested change.',
    });
    await sleep(1500);
    // Step 5: assistant proposes write EOF patch and asks for approval
    pushChatMessage({
      role: 'assistant',
      content:
        'To apply the change, I need to execute a write operation in ADE style (`write ... EOF`).\n\nHere is the proposed rewrite for `demo_rules.txt`:\n```ade\nwrite demo_rules.txt\nADE rules the world\nEOF\n```\nIf you approve, ADE will overwrite the demo file content with the text above (in this demo it is only simulated, no real files are touched).\n\nDo you want to approve this modification?\n[APPROVE] [REJECT] (simulated in this demo)',
    });
    await sleep(1500);
    // Step 6: user approves modification
    pushChatMessage({
      role: 'user',
      content: 'Approve: I confirm the proposed modification to demo_rules.txt.',
    });
    await sleep(1200);
    // Step 7: assistant executes simulated plan and summarizes
    pushChatMessage({
      role: 'assistant',
      content:
        'APPROVE received (simulated).\n\nExecuting the plan:\n- Step 1: read file `demo_rules.txt` (already done).\n- Step 2: apply the proposed rewrite with `write ... EOF`.\n\nNew (simulated) content of `demo_rules.txt`:\n```txt\nADE rules the world\n```\nThis is exactly the kind of flow ADE uses in reality:\n- first it reads the files,\n- then it shows you the patches in clear text,\n- finally it asks for an explicit APPROVAL before writing.',
    });
    setIsDemoChatRunning(false);
  };
  const sendChatMessage = () => {
    const text = chatInput.trim();
    if (!text) return;
    const userMsg: ChatMessage = { role: 'user', content: text };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsChatBusy(true);
    // Simulazione risposta ADE, senza chiamare backend
    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content:
           'This is a demo response.\nIn a real DevConsole, ADE would use this message to:\n- read the current state,\n- propose a Forge plan,\n- or suggest ade-* commands to run.\n\nUser text:\n' +
          text,
      };
      setChatMessages((prev) => [...prev, assistantMsg]);
      setIsChatBusy(false);
    }, 600);
  };
  const openGuidedDemoOverlay = () => {
    // Quando apri la Guided Demo, porta l’utente sulla tab Observer
    setActiveTab('observer');
    setIsDemoOverlayOpen(true);
    // Facoltativo: far partire anche lo script di chat demo
    runDemoChatScript();
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
          placeholder="Command(es. ade-state)"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
        />
        <input
          type="text"
          placeholder="Args (space-separated)"
          value={args}
          onChange={(e) => setArgs(e.target.value)}
        />
        <button onClick={runCommand} disabled={isRunning}>
          {isRunning ? 'Running...' : 'Run'}
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
            No output yet. Run a command.
          </div>
        )}
      </div>
      <div className="console-history">
        <h3>History</h3>
        {consoleHistory.length === 0 ? (
          <div className="placeholder">No history available.</div>
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
          <h3>Events</h3>
          {events.length === 0 ? (
            <div className="placeholder">No events available</div>
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
          <h3>Suggestions</h3>
          {suggestions.length === 0 ? (
            <div className="placeholder">No suggestions available.</div>
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
          <label>Plan name</label>
          <input
            type="text"
            placeholder="Plan name"
            value={forgePlanName}
            onChange={(e) => setForgePlanName(e.target.value)}
          />
        </div>
        <div className="field-row">
          <label>Plan goal</label>
          <input
            type="text"
            placeholder="Plan Goal"
            value={forgeGoal}
            onChange={(e) => setForgeGoal(e.target.value)}
          />
        </div>
        <div className="forge-buttons">
          <button onClick={createForgePlan} disabled={isForgeBusy}>
            {isForgeBusy ? 'Creating...' : 'Create plan'}
          </button>
          <button onClick={runForgePlan} disabled={isForgeBusy}>
            {isForgeBusy ? 'Running...' : 'Run plan'}
          </button>
        </div>
      </div>
      {forgeError && <div className="error-box">{forgeError}</div>}
      <div className="forge-status">
        <h3>Forge plan status</h3>
        {forgeStatus ? (
          <pre className="ok">{JSON.stringify(forgeStatus, null, 2)}</pre>
        ) : (
          <div className="placeholder">
            No plan has been created or run yet.
          </div>
        )}
      </div>
    </div>
  );
  const renderMemoryTab = () => (
    <div className="memory-tab">
      <div className="memory-write">
        <h3>Write memory</h3>
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
          <label>Tags (separated by comma)</label>
          <input
            type="text"
            placeholder="Tags (separated by comma)"
            value={memoryTags}
            onChange={(e) => setMemoryTags(e.target.value)}
          />
        </div>
        <button onClick={putMemoryItem} disabled={isMemoryBusy}>
          {isMemoryBusy ? 'Saving...' : 'Save'}
        </button>
      </div>
      <div className="memory-query">
        <h3>Search memory</h3>
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
          {isMemoryBusy ? 'Searching...' : 'Search'}
        </button>
        {memoryError && <div className="error-box">{memoryError}</div>}
      </div>
      <div className="memory-results">
        <h3>Results</h3>
        {memoryItems.length === 0 ? (
          <div className="placeholder">No results.</div>
        ) : (
          <ul>
            {memoryItems.map((item, idx) => (
              <li key={idx}>
                <div className="memory-key">{item.key}</div>
                <div className="memory-content">{item.content}</div>
                <div className="memory-tags">
                  Tags:{' '}
                  {item.tags && item.tags.length > 0
                    ? item.tags.join(', ')
                    : '—'}
                </div>
                <div className="memory-ts">TS: {item.ts}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
  const renderChatTab = () => (
    <div className="chat-tab">
      <div className="chat-log">
        {chatMessages.map((m, idx) => (
          <div key={idx} className={`chat-message chat-${m.role}`}>
            <div className="chat-role">{m.role === 'user' ? 'TU' : 'ADE'}</div>
            <div className="chat-content">
              {m.content.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="chat-input-row">
        <textarea
          placeholder="Write a message for ADE..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
        />
        <button
          onClick={sendChatMessage}
          disabled={isChatBusy || !chatInput.trim()}
        >
          {isChatBusy ? 'Simulation...' : 'Send'}
        </button>
      </div>
    </div>
  );
  return (
    <div className="console-container">
      <header>
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div>
            <h1>ADE DEMO CONSOLE</h1>
          </div>
          <button
            onClick={openGuidedDemoOverlay}
            style={{
              padding: '6px 12px',
              fontSize: 12,
              borderRadius: 999,
              border: '1px solid #4f46e5',
              backgroundColor: '#4f46e5',
              color: '#f9fafb',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Run Guided Demo
          </button>
        </div>
        <nav className="tabs">
          <button
            className={`tab-button tab-console ${
              activeTab === 'chat' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('chat')}
          >
            Chat
          </button>
          <button
            className={`tab-button ${
              activeTab === 'console' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('console')}
          >
            Console
          </button>
          <button
            className={`tab-button ${
              activeTab === 'observer' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('observer')}
          >
            Observer
          </button>
          <button
            className={`tab-button ${
              activeTab === 'forge' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('forge')}
          >
            Forge
          </button>
          <button
            className={`tab-button ${
              activeTab === 'memory' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('memory')}
          >
            Memory
          </button>
        </nav>
      </header>
      <main>
        {activeTab === 'chat' && renderChatTab()}
        {activeTab === 'console' && renderConsoleTab()}
        {activeTab === 'observer' && renderObserverTab()}
        {activeTab === 'forge' && renderForgeTab()}
        {activeTab === 'memory' && renderMemoryTab()}
      </main>
      {isDemoOverlayOpen && (
        <div
          className="guided-demo-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15,23,42,0.85)',
            color: '#e5e7eb',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 50,
          }}
        >
          <div
            style={{
              maxWidth: 720,
              maxHeight: '80vh',
              overflowY: 'auto',
              backgroundColor: '#020617',
              borderRadius: 12,
              border: '1px solid #4f46e5',
              padding: 20,
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <h2 style={{ fontSize: 18, fontWeight: 600 }}>
                Guided Demo — Observer scenario
              </h2>
              <button
                onClick={() => setIsDemoOverlayOpen(false)}
                style={{
                  padding: '4px 10px',
                  fontSize: 12,
                  borderRadius: 999,
                  border: '1px solid #6b7280',
                  backgroundColor: '#020617',
                  color: '#e5e7eb',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
            <p style={{ fontSize: 13, marginBottom: 12 }}>
              This is a guided, deterministic scenario that shows how ADE’s Observer recognizes the pattern
              <code>config.yaml + docker-compose restart</code> and proposes a suggestion.
            </p>
            <div
              style={{
                fontSize: 13,
                lineHeight: 1.5,
                marginBottom: 16,
                borderLeft: '2px solid #4f46e5',
                paddingLeft: 10,
              }}
            >
              {guidedDemoSteps.map((step, idx) => (
                <p key={idx} style={{ marginBottom: 8 }}>
                  <span style={{ opacity: 0.7 }}>
                    [{step.t}s] {step.speaker}:
                  </span>{' '}
                  {step.text}
                </p>
              ))}
            </div>
            <div
              style={{
                fontSize: 13,
                backgroundColor: '#020617',
                borderRadius: 8,
                border: '1px solid #1f2937',
                padding: 10,
                marginBottom: 8,
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 6 }}>
                How to reproduce this scenario on your PC
              </div>
              <ol style={{ paddingLeft: 18, margin: 0 }}>
                <li style={{ marginBottom: 4 }}>
                 Make sure the demo is running (backend + UI) — you can use the scripts <code>scripts/run-demo.sh</code> or <code>scripts/run-demo.ps1</code>.
                </li>
                <li style={{ marginBottom: 4 }}>
                  In a terminal, from the root folder{' '}
                  <code>demo_github/ade-demo-suite</code>, run:
                  <pre
                    style={{
                      marginTop: 4,
                      marginBottom: 4,
                      padding: 6,
                      backgroundColor: '#020617',
                      borderRadius: 4,
                      border: '1px solid #111827',
                    }}
                  >
                    python demo/demo_runner.py --scenario observer
                  </pre>
                </li>
                <li>
                  Go back to the <strong>Observer</strong> tab in this UI and watch how the events appear together with the “Automate Restart” suggestion.
                </li>
              </ol>
            </div>
            <p style={{ fontSize: 12, opacity: 0.7 }}>
              Note: in this local version everything is scripted and deterministic.
              The goal is to showcase the kind of experience ADE can offer, not
              to simulate every possible real-world case.
            </p>
          </div>
        </div>
      )}

      <footer
        style={{
          marginTop: 8,
          padding: '4px 8px',
          fontSize: 11,
          color: '#9ca3af',
          borderTop: '1px solid #111827',
        }}
      >
        © ADE Cubed Inc. — Demo only, not for production use.
      </footer>
      </div>
      );
      };
export default App;