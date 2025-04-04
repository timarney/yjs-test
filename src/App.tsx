import { useSyncedStore } from "@syncedstore/react";
import React, { useState } from "react";
import { globalStore, HOST } from "./store";
import { getYjsValue } from "@syncedstore/core";

import { WebsocketProvider } from "y-partykit/provider";

import "./index.css";



function App() {
  const store = useSyncedStore(globalStore);
  const [view, setView] = useState<"all" | "active" | "completed">("all");

  const provider = new WebsocketProvider(
    HOST,
    "gc-forms-1",
    getYjsValue(globalStore) as any
  ); // sync via partykit

  const awareness = provider.awareness;

  function onKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      const target = event.target as HTMLInputElement;
      store.todos.push({ completed: false, title: target.value });
      target.value = "";
    }
  }

  return (
    <div className="todoRoot">
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
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
                  <li key={index}>{todo.title}</li>
                ))}
              </ul>
            </section>
          </>
        )}
      </section>
      <footer className="info">-</footer>
    </div>
  );
}

export default App;
