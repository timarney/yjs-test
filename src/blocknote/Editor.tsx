import * as Y from "yjs";
import * as React from "react";
import YPartyKitProvider from "y-partykit/provider";

import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

import { cn } from "@sglara/cn";

import { User } from "./randomUser";

export const Editor = ({
  id,
  fragment,
  mode,
  user,
  provider,
  onClick,
}: {
  id: string;
  fragment: Y.XmlFragment;
  mode: "edit" | "view";
  provider: YPartyKitProvider;
  user: User;
  onClick?: (e) => void;
}) => {
  const editor = useCreateBlockNote({
    collaboration: {
      // The Yjs Provider responsible for transporting updates:
      provider,
      // Where to store BlockNote data in the Y.Doc:
      fragment,
      // Information (name and color) for this user:
      //user: mode === "edit" ? user : { name: "", color: "#000000" },
      user: user,
    },
  });
  return (
    <div
      className={cn(
        "mb-10",
        "border-2 border-gray-400 rounded-[10px]",
        mode === "edit" && "border-blue-500"
      )}
    >
      <BlockNoteView
        id={id}
        onClick={onClick}
        editor={editor}
      />
    </div>
  );
};
