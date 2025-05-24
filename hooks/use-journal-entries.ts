import { TypeSupabaseClient } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

import {
  addJournalEntry,
  AddJournalEntryInput,
  getJournal,
  getJournalEntry,
} from '@/lib/queries/journal-entries';
import { getQueryClient } from '@/components/providers/query-provider';

export const getJournalQueryParams = (
  client: TypeSupabaseClient,
  userId: string
) => ({
  queryKey: ['journal'],
  queryFn: () => getJournal(client, userId).then((res) => res.data),
});

export function useJournal({
  client,
  userId,
  enabled = true,
}: {
  client: TypeSupabaseClient;
  userId: string;
  enabled?: boolean;
}) {
  return useQuery({
    ...getJournalQueryParams(client, userId),
    enabled,
  });
}

export function useJournalEntry({
  client,
  entryId,
}: {
  client: TypeSupabaseClient;
  entryId: string;
}) {
  return useQuery({
    queryKey: ['journal', 'entries', entryId],
    queryFn: () => getJournalEntry(client, entryId).then((res) => res.data),
  });
}

export function useAddJournalEntry({ client }: { client: TypeSupabaseClient }) {
  return useMutation({
    mutationFn: async (entry: AddJournalEntryInput) =>
      addJournalEntry(client, entry),
    onSuccess: () => {
      getQueryClient().invalidateQueries({
        queryKey: ['journal'],
      });
    },
    onError: (error) => console.error(error),
  });
}
