import { syncedStore } from "@syncedstore/core";

export type Todo = {
  title: string;
  completed: boolean;
};

export const globalStore = syncedStore({ todos: [] as Todo[] });

const PARTYKIT_HOST = import.meta.env.VITE_PARTYKIT_HOST || "localhost:3000";

export const HOST = `wss://${PARTYKIT_HOST}/party`;