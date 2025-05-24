import { TypeSupabaseClient } from '@/types';

type JournalRow = {
  folder_id: string | null;
  folder_name: string;
  entry_id: string;
  entry_title: string;
  created_at: string;
};

export type JournalGroup = {
  id: string | null;
  name: string;
  entries: {
    id: string;
    title: string;
    created_at: string;
  }[];
};

export const groupJournal = (rows: JournalRow[]): JournalGroup[] => {
  const folderMap = new Map<string | null, JournalGroup>();

  for (const row of rows) {
    const key = row.folder_id ?? '__uncategorized__';

    if (!folderMap.has(key)) {
      folderMap.set(key, {
        id: row.folder_id,
        name: row.folder_name,
        entries: [],
      });
    }

    folderMap.get(key)!.entries.push({
      id: row.entry_id,
      title: row.entry_title,
      created_at: row.created_at,
    });
  }

  return Array.from(folderMap.values());
};

export const getJournal = async (
  client: TypeSupabaseClient,
  userId: string
) => {
  return client
    .rpc('get_journal', {
      uid: userId,
    })
    .throwOnError();
};

export const getJournalEntry = async (
  client: TypeSupabaseClient,
  entryId: string
) => {
  return client
    .from('journal_entries')
    .select('*')
    .eq('id', entryId)
    .single()
    .throwOnError();
};

export type AddJournalEntryInput = {
  id?: string;
  title: string;
  date?: string | null;
  content?: string;
  portfolioId: string;
  folderId?: string | null;
  userId: string;
};

export const addJournalEntry = async (
  client: TypeSupabaseClient,
  entry: AddJournalEntryInput
) => {
  const input = {
    ...entry,
    folder_id: entry.folderId,
    portfolio_id: entry.portfolioId,
    user_id: entry.userId,
  };

  return client.from('journal_entries').insert(input).throwOnError();
};
