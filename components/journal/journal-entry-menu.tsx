'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronRightIcon,
  FolderClosedIcon,
  FolderOpenIcon,
  MoreHorizontalIcon,
  NotebookTextIcon,
} from 'lucide-react';

import { groupJournal } from '@/lib/queries/journal-entries';
import { useJournal } from '@/hooks/use-journal-entries';
import { useSupabase } from '@/hooks/use-supabase';
import { useUserId } from '@/hooks/use-user-id';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';

export default function JournalEntryMenu() {
  const client = useSupabase();
  const userId = useUserId();
  const { data = [], isLoading } = useJournal({
    client,
    userId,
    enabled: !!userId,
  });
  const { folders, uncategorizedEntries } = useMemo(() => {
    const grouped = groupJournal(data);

    const folders = grouped.filter((group) => group.id !== null);
    const uncategorizedEntries = grouped.find((group) => group.id === null);

    return { folders, uncategorizedEntries };
  }, [data]);

  if (isLoading) {
    return (
      <SidebarMenu>
        {Array.from({ length: 5 }).map((_, index) => (
          <SidebarMenuItem key={index}>
            <SidebarMenuSkeleton showIcon />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      {/* Journal Folders Section */}
      {folders.map((folder) => (
        <Collapsible key={folder.id} className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton>
                <ChevronRightIcon className="transition-transform group-data-[state=open]/collapsible:rotate-90" />
                <div className="relative size-4 flex-shrink-0">
                  <FolderClosedIcon className="absolute block size-4 group-data-[state=open]/collapsible:hidden" />
                  <FolderOpenIcon className="absolute hidden size-4 group-data-[state=open]/collapsible:block" />
                </div>

                {folder.name}
              </SidebarMenuButton>
            </CollapsibleTrigger>

            <SidebarMenuAction>
              <MoreHorizontalIcon aria-label="More journal folder actions" />
            </SidebarMenuAction>
            <CollapsibleContent>
              <SidebarMenuSub>
                {folder.entries.map((entry) => (
                  <SidebarMenuSubItem key={entry.id}>
                    <SidebarMenuSubButton>
                      <NotebookTextIcon />
                      <span className="min-w-0 truncate">{entry.title}</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      ))}

      {/* Uncategorized Entries Section */}
      {uncategorizedEntries?.entries?.map((entry) => (
        <SidebarMenuButton key={entry.id} asChild>
          <Link href={'/journal/entries/' + entry.id}>
            <NotebookTextIcon />
            <span className="min-w-0 truncate">{entry.title}</span>
          </Link>
        </SidebarMenuButton>
      ))}
    </SidebarMenu>
  );
}
