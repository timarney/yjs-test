import { syncedStore } from "@syncedstore/core";

export type Todo = {
  title: string;
  completed: boolean;
};

export type docs = "doc1" | "doc2" | "doc3";

export const globalStore = syncedStore({
  todos: [] as Todo[],
  doc1: "xml",
  doc2: "xml",
  doc3: "xml",
});



const PARTYKIT_HOST = (import.meta as any).env?.VITE_PARTYKIT_HOST || "localhost:3000";

export const HOST = `wss://${PARTYKIT_HOST}/party`;
