import * as React from "react";
import YPartyKitProvider from "y-partykit/provider";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import * as Y from "yjs";

import { getRandomUser } from "./randomUser";


const PARTYKIT_HOST = import.meta.env.VITE_PARTYKIT_HOST || "localhost:3000";

const doc = new Y.Doc();
const provider = new YPartyKitProvider(PARTYKIT_HOST, "my-document-id", doc);

export const Editor = () => {
  const editor = useCreateBlockNote({
    collaboration: {
      // The Yjs Provider responsible for transporting updates:
      provider,
      // Where to store BlockNote data in the Y.Doc:
      fragment: doc.getXmlFragment("document-store"),
      // Information (name and color) for this user:
      user: getRandomUser(),
    },
  });
  return <BlockNoteView editor={editor} />;
};
