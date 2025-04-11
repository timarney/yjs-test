import * as Y from "yjs";
import * as React from "react";
import YPartyKitProvider from "y-partykit/provider";

import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

import { User } from "./randomUser";

export const Editor = ({
  fragment,
  mode,
  user,
  provider,
}: {
  fragment: Y.XmlFragment;
  mode: "edit" | "view";
  provider: YPartyKitProvider;
  user: User;
}) => {
  const editor = useCreateBlockNote({
    collaboration: {
      // The Yjs Provider responsible for transporting updates:
      provider,
      // Where to store BlockNote data in the Y.Doc:
      fragment,
      // Information (name and color) for this user:
      user,
    },
  });
  return (
    <BlockNoteView
      autoFocus={mode === "edit" ? true : false}
      editable={mode === "edit" ? true : false}
      editor={editor}
    />
  );
};
