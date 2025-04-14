import React, { useCallback, useEffect, useState } from "react";
import YPartyKitProvider, { WebsocketProvider } from "y-partykit/provider";
import { useSyncedStore } from "@syncedstore/react";
import { getYjsValue } from "@syncedstore/core";

// Extend the Window interface to include documentStore
declare global {
  interface Window {
    documentStore: any;
  }
}

import { globalStore } from "./store";
import "./index.css";

import { getRandomUser } from "./blocknote/randomUser";
import { Editor } from "./blocknote/Editor";

const doc = getYjsValue(globalStore) as any;

const PARTYKIT_HOST =
  (import.meta as any).env?.VITE_PARTYKIT_HOST || "localhost:3000";

const provider = new YPartyKitProvider(PARTYKIT_HOST, "my-document-id", doc);

window.documentStore = doc; // expose the document store to the window object

const user = getRandomUser();

function App() {
  const store = useSyncedStore(globalStore);

  const [activeNote, setActiveNote] = useState<typeof doc>("doc1");
  const [loading, setLoading] = useState(false);

  const [activeCount, setActiveCount] = useState(0);

  const yjsProvider = provider as WebsocketProvider;

  // const name = yjsProvider.awareness.getLocalState()?.user?.name;

  const handleAwarenessUpdate = useCallback(() => {
    const awareness = yjsProvider.awareness;
    const clients = awareness.getStates();
    const clientsArray = Array.from(clients.values());
    setActiveCount(clientsArray.length);
  }, [yjsProvider]);

  useEffect(() => {
    if (yjsProvider == null) {
      return;
    }

    yjsProvider.awareness.on("update", handleAwarenessUpdate);

    return () => yjsProvider.awareness.off("update", handleAwarenessUpdate);
  }, [yjsProvider, handleAwarenessUpdate]);

  function onKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      const target = event.target as HTMLInputElement;
      store.todos.push({ completed: false, title: target.value });
      target.value = "";
    }
  }

  const removeTodo = (index: number) => {
    store.todos.splice(index, 1);
  };

  const handleClick = (e) => {
    console.log("clicked", e);
    setActiveNote(e.currentTarget.id);
  };

  const editors = [
    { id: "doc1", title: "Document 1" },
    { id: "doc2", title: "Document 2" },
    { id: "doc3", title: "Document 3" },
  ];
  const editorComponents = editors.map((editor) => (
    <div className="mb-10" key={editor.id}>
      <Editor
        id={editor.id}
        onClick={handleClick}
        mode={activeNote === editor.id ? "edit" : "view"}
        fragment={doc.getXmlFragment(editor.id)}
        provider={provider}
        user={user}
      />
    </div>
  ));

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-100 p-4 shadow">
        <h1 className="text-lg font-bold">Yjs Test</h1>
      </header>
      <main className="flex-1 p-4">
        <section className="mb-4">
          {activeCount && activeCount >= 1 && (
            <div className="active-clients mb-2">
              <span className="active-clients-count text-sm">
                {activeCount} active clients
              </span>
            </div>
          )}

          <div className="mb-10">{editorComponents}</div>

          <div className="mb-10">
            <div>
              <input
                className="new-todo border rounded p-2 w-full mb-10"
                placeholder="Add a message"
                autoFocus
                onKeyPress={onKeyPress}
              />
              <ul className="space-y-2">
                {store.todos.map((todo, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between border-b border-b-gray-400 pb-2 max-w-md"
                  >
                    <span>{todo.title}</span>
                    <button
                      className="text-red-500 hover:text-red-700 font-bold"
                      onClick={() => removeTodo(index)}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-gray-100 p-4 text-center">
        <p className="text-sm">Footer content here</p>
      </footer>
    </div>
  );
}

export default App;
