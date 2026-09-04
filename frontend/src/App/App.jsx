import "./App.css";
import { Editor } from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import { SocketIOProvider } from "y-socket.io";
import { useRef, useMemo, useState } from "react";
import * as Y from "yjs";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

function App() {
  const editorRef = useRef(null);

  const [username, setUsername] = useState("");
  const [inputUsername, setInputUsername] = useState("");
  const [users, setUsers] = useState([]);

  const ydoc = useMemo(() => new Y.Doc(), []);
  const yText = useMemo(() => ydoc.getText("monaco"), [ydoc]);

  const handleMount = (editor) => {
    editorRef.current = editor;

    const provider = new SocketIOProvider(SOCKET_URL, "monaco", ydoc, {
      autoConnect: true,
    });

    provider.awareness.setLocalStateField("user", {
      name: username,
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
    });

    provider.awareness.on("change", () => {
      const states = Array.from(provider.awareness.getStates().values());
      setUsers(states.map((s) => s.user).filter(Boolean));
    });

    new MonacoBinding(
      yText,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      provider.awareness
    );
  };

  const handleJoin = () => {
    if (inputUsername.trim()) {
      setUsername(inputUsername);
    }
  };

  if (!username) {
    return (
      <main className="h-screen w-full bg-gray-950 flex items-center justify-center">
        <div className="w-96 bg-neutral-900 rounded-lg p-6">
          <h1 className="text-white text-2xl font-bold mb-4">
            CodeSync
          </h1>

          <input
            type="text"
            placeholder="Enter your username"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            className="w-full bg-neutral-800 text-white rounded-lg px-4 py-3 mb-4 outline-none"
          />

          <button
            onClick={handleJoin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-3"
          >
            Join Room
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen w-full bg-gray-950 flex flex-col p-2 gap-2">
      <header className="w-full bg-neutral-900 rounded-lg px-4 py-3 flex items-center justify-between">
        <h1 className="text-white text-xl font-bold">CodeSync</h1>

        <span className="text-gray-400 text-sm">
          Logged in as <span className="text-white">{username}</span>
        </span>
      </header>

      <div className="flex-1 flex gap-4 min-h-0">
        <aside className="h-full w-2/5 bg-neutral-900 rounded-lg p-4">
          <h2 className="text-white text-lg font-bold mb-3">
            Online — {users.length}
          </h2>

          <ul className="space-y-2">
            {users.map((u, i) => (
              <li key={i} className="flex items-center gap-2 text-white">
                <span
                  className="w-3 h-3 rounded-full inline-block"
                  style={{ backgroundColor: u.color }}
                ></span>

                {u.name}

                {u.name === username ? " (you)" : ""}
              </li>
            ))}
          </ul>
        </aside>

        <section className="w-3/5 h-full bg-neutral-800 rounded-lg overflow-hidden">
          <Editor
            height="100%"
            width="100%"
            theme="vs-dark"
            language="javascript"
            defaultValue="// Write your code here"
            onMount={handleMount}
            options={{
              fontSize: 16,
              minimap: { enabled: false },
              automaticLayout: true,
              wordWrap: "on",
            }}
          />
        </section>
      </div>
    </main>
  );
}

export default App;