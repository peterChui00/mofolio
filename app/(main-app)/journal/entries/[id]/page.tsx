import JournalEntryEditor from '@/components/journal/journal-entry-editor';
import JournalEntryHeader from '@/components/journal/journal-entry-header';
import { JournalToolbar } from '@/components/journal/journal-toolbar';

export default async function JournalEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  return (
    <>
      <JournalToolbar />
      <div className="flex h-full flex-1 gap-4">
        <div className="flex flex-1 flex-col space-y-2">
          <JournalEntryHeader id={id} />
          <JournalEntryEditor id={id} />
        </div>
      </div>
    </>
  );
}
