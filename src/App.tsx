import { useSyncedStore } from "@syncedstore/react";
import React, { useCallback, useEffect, useState } from "react";
import { globalStore, HOST } from "./store";
import { getYjsValue } from "@syncedstore/core";

import { WebsocketProvider } from "y-partykit/provider";

import "./index.css";

import { Editor } from "./blocknote/Editor";

const provider = new WebsocketProvider(
  HOST,
  "gc-forms-1",
  getYjsValue(globalStore) as any
); // sync via partykit

function App() {
  const store = useSyncedStore(globalStore);

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

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-100 p-4 shadow">
        <h1 className="text-lg font-bold">Yjs Test</h1>
      </header>
      <main className="flex-1 p-4">
        <section className="mb-4">
          {activeCount && (
            <div className="active-clients mb-2">
              <span className="active-clients-count text-sm">
                {activeCount} active clients
              </span>
            </div>
          )}
          <div className="">
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

          <div className="mt-10">
            <Editor />
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
