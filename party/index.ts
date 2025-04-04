import type * as Party from "partykit/server";
import { onConnect } from "y-partykit";

export default class YjsServer implements Party.Server {
  constructor(public room: Party.Room) {}
  onConnect(conn: Party.Connection) {
    return onConnect(conn, this.room, {
      // experimental: persists the document to partykit's room storage
      persist: { mode: "snapshot" },

      // enable read only access to true to disable editing, default: false
      readOnly: false,

      callback: {
        async handler(yDoc) {
          // called every few seconds after edits
          // you can use this to write to a database
          // or some external storage
        },
        // control how often handler is called with these options
        debounceWait: 10000, // default: 2000 ms
        debounceMaxWait: 20000, // default: 10000 ms
        timeout: 5000 // default: 5000 ms
      }
    });
  }
}

YjsServer satisfies Party.Worker;
