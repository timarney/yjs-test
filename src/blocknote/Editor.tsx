import * as React from "react";
import YPartyKitProvider from "y-partykit/provider";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import * as Y from "yjs";

import { User } from "./randomUser";

const PARTYKIT_HOST =
  (import.meta as any).env?.VITE_PARTYKIT_HOST || "localhost:3000";

const doc = new Y.Doc();
const provider = new YPartyKitProvider(PARTYKIT_HOST, "my-document-id", doc);

export const Editor = ({
  fragment,
  user,
}: {
  fragment: string;
  user: User;
}) => {
  const editor = useCreateBlockNote({
    collaboration: {
      // The Yjs Provider responsible for transporting updates:
      provider,
      // Where to store BlockNote data in the Y.Doc:
      fragment: doc.getXmlFragment(fragment),
      // Information (name and color) for this user:
      user,
    },
  });
  return <BlockNoteView editor={editor} />;
};
