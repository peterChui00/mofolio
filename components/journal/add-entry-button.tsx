'use client';

import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useStore } from '@/components/providers/app-store-provider';

export default function AddEntryButton() {
  const toggleEditJournalEntryDialog = useStore(
    (state) => state.toggleEditJournalEntryDialog
  );

  return (
    <Button onClick={() => toggleEditJournalEntryDialog()}>
      <PlusIcon />
      Add Entry
    </Button>
  );
}
