'use client';

import { createContext, use, useMemo } from 'react';
import type { Editor } from '@tiptap/react';

export type EditorContextProps = {
  editor: Editor;
};

export const EditorContext = createContext<EditorContextProps | null>(null);

type EditorProviderProps = {
  editor: Editor;
  children: React.ReactNode;
};

export const EditorProvider = ({ editor, children }: EditorProviderProps) => {
  const contextValue = useMemo(() => ({ editor }), [editor]);
  return <EditorContext value={contextValue}>{children}</EditorContext>;
};

export const useEditorContext = () => {
  const context = use(EditorContext);

  if (!context) {
    throw new Error('useEditorContext must be used within a EditorProvider');
  }

  return context;
};
