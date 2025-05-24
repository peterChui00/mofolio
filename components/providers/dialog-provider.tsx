import GeneralConfirmationDialog from '@/components/general-confirmation-dialog';
import EditJournalEntryDialog from '@/components/journal/edit/edit-journal-entry-dialog';
import EditTagDialog from '@/components/tags/edit-tag-dialog';
import EditTagGroupDialog from '@/components/tags/edit-tag-group-dialog';
import EditTradeDialog from '@/components/trades/edit/edit-trade-dialog';

export default function DialogProvider() {
  return (
    <>
      <GeneralConfirmationDialog />
      <EditTradeDialog />
      <EditTagGroupDialog />
      <EditTagDialog />
      <EditJournalEntryDialog />
    </>
  );
}
