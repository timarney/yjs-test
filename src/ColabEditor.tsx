/**
 * External dependencies
 */
import { useRef, forwardRef, useCallback, useState, useImperativeHandle, useEffect } from "react";

import { WebsocketProvider } from "y-partykit/provider";
import * as Y from "yjs";

import { HOST } from "./store";

import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";

/**
 * Internal dependencies
 */
import Editor from "./Editor/Editor";
import Theme from "./Editor/Theme";
import React from "react";

const editorConfig = {
  // NOTE: This is critical for collaboration plugin to set editor state to null. It
  // would indicate that the editor should not try to set any default state
  // (not even empty one), and let collaboration plugin do it instead
  editorState: null,
  namespace: "documentID-m-28-gcforms-app",
  nodes: [],
  // Handling of errors during update
  onError(error: Error) {
    throw error;
  },
  // The editor theme
  theme: Theme,
};

export interface ColabEditorProps {
  id: string;
  profile: { id: string; name: string; color: string };
}

import { Provider } from "@lexical/yjs";

export const ColabEditor = forwardRef(
  ({ id, profile }: ColabEditorProps, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [yjsProvider, setYjsProvider] = useState<null | Provider>(null);

    const providerFactory = useCallback(
      (id: string, yjsDocMap: Map<string, Y.Doc>) => {
        const doc = new Y.Doc();
        yjsDocMap.set(id, doc);

        const provider = new WebsocketProvider(
          HOST,
          id,
          doc
        ) as unknown as Provider;

        // Debugging logs for WebSocket lifecycle
        provider.on("status", (event) => {
          console.log("WebSocket status:", event);
        });

        // This is a hack to get reference to provider with standard CollaborationPlugin.
        // To be fixed in future versions of Lexical.
        setTimeout(() => setYjsProvider(provider), 0);
        return provider;
      },
      [setYjsProvider, profile]
    );

    const handleAwarenessUpdate = useCallback(() => {
      const awareness = yjsProvider!.awareness!;
      /*
      setActiveUsers(
        Array.from(awareness.getStates().entries()).map(
          ([userId, { color, name }]) => ({
            color,
            name,
            userId,
          })
        )
      );
      */
    }, [yjsProvider]);

    useImperativeHandle(ref, () => ({
      clearAwarenessState: () => {
        if (yjsProvider) {
          yjsProvider.awareness.setLocalStateField("name", null);
          yjsProvider.awareness.setLocalStateField("color", null);
          yjsProvider.awareness.setLocalStateField("focusing", false);
          yjsProvider.awareness.setLocalStateField("anchorPos", null);
        }
      },
    }));

    useEffect(() => {
      if (yjsProvider == null) {
        return;
      }

      yjsProvider.awareness.on("update", handleAwarenessUpdate);

      return () => yjsProvider.awareness.off("update", handleAwarenessUpdate);
    }, [yjsProvider, handleAwarenessUpdate]);

    return (
      <div ref={containerRef} className="relative">
        <LexicalComposer initialConfig={editorConfig}>
          {/* With CollaborationPlugin - we MUST NOT use @lexical/react/LexicalHistoryPlugin */}
          <CollaborationPlugin
            id={id}
            providerFactory={providerFactory}
            // Unless you have a way to avoid race condition between 2+ users trying to do bootstrap simultaneously
            // you should never try to bootstrap on client. It's better to perform bootstrap within Yjs server.
            shouldBootstrap={false}
            username={profile.name}
            cursorColor={profile.color}
            cursorsContainerRef={containerRef}
          />
          <Editor />
        </LexicalComposer>
      </div>
    );
  }
);
