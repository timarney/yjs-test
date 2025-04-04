import { useSyncedStore } from "@syncedstore/react";
import React, { useCallback, useEffect, useState } from "react";
import { globalStore, HOST } from "./store";
import { getYjsValue } from "@syncedstore/core";

import { WebsocketProvider } from "y-partykit/provider";

import "./index.css";

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
    console.log(clientsArray);
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
    <div className="todoRoot">
      <section className="todoapp">
        <header className="header">
          <h1>Yjs Test</h1>

          {activeCount && (
            <div className="active-clients mr-10">
              <span className="active-clients-count">
                {activeCount} active clients
              </span>
            </div>
          )}

          <input
            className="new-todo"
            placeholder="What needs to be done?"
            autoFocus
            onKeyPress={onKeyPress}
          />
        </header>
        {!!store.todos.length && (
          <>
            <section className="main">
              <ul className="todo-list">
                {store.todos.map((todo, index) => (
                  <li key={index}>
                    <button
                      onClick={() => {
                        removeTodo(index);
                      }}
                    >
                      {todo.title}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </section>
    </div>
  );
}

export default App;
