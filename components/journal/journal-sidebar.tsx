'use client';

import { NotepadTextDashedIcon, PlusIcon } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import JournalEntryMenu from '@/components/journal/journal-entry-menu';
import { useStore } from '@/components/providers/app-store-provider';

// Mock data for templates
const templates = [
  { id: '1', name: 'Daily Review' },
  { id: '2', name: 'Trade Analysis' },
  { id: '3', name: 'Weekly Summary and Performance Metrics' },
  { id: '4', name: 'Monthly Performance' },
];

export default function JournalSidebar() {
  const toggleEditJournalEntryDialog = useStore(
    (state) => state.toggleEditJournalEntryDialog
  );

  const addJournalEntry = () => {
    toggleEditJournalEntryDialog();
  };

  return (
    <Sidebar collapsible="none" className="bg-background">
      <SidebarContent className="p-4 pr-0">
        <SidebarGroup>
          <SidebarGroupLabel>Entries</SidebarGroupLabel>
          <SidebarGroupAction
            aria-label="Add journal entry"
            onClick={addJournalEntry}
          >
            <PlusIcon />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <JournalEntryMenu />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Templates</SidebarGroupLabel>
          <SidebarGroupAction aria-label="Add journal template">
            <PlusIcon />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {templates.map((template) => (
                <SidebarMenuItem key={template.id}>
                  <SidebarMenuButton>
                    <NotepadTextDashedIcon />
                    <span className="min-w-0 truncate">{template.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
