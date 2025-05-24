'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { useJournalEntry } from '@/hooks/use-journal-entries';
import { useSupabase } from '@/hooks/use-supabase';
import { Skeleton } from '@/components/ui/skeleton';
import { EditorProvider } from '@/components/editor/editor';

const extensions = [StarterKit];

export default function JournalEntryEditor({ id }: { id: string }) {
  const client = useSupabase();
  const { isLoading } = useJournalEntry({
    client,
    entryId: id,
  });

  const editor = useEditor({
    extensions,
    content: undefined,
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
  });

  if (!editor || isLoading) {
    return <Skeleton className="size-full min-h-60" />;
  }

  return (
    <EditorProvider editor={editor}>
      <div className="min-h-60 cursor-text rounded-lg border p-4 [&_.ProseMirror-focused]:outline-none">
        <EditorContent editor={editor} />
      </div>
    </EditorProvider>
  );
}
