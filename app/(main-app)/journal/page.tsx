import { Metadata } from 'next';

import AddEntryButton from '@/components/journal/add-entry-button';

export const metadata: Metadata = {
  title: 'Journal',
};

export default function JournalPage() {
  return (
    <div className="flex h-full items-center justify-center text-center">
      <div>
        <h2 className="mb-2 text-xl font-semibold">
          No journal entry selected
        </h2>
        <p className="text-muted-foreground mb-4">
          Start by selecting or creating a new entry.
        </p>
        <AddEntryButton />
      </div>
    </div>
  );
}
