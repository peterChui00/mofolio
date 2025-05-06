'use client';

import { SquarePlusIcon } from 'lucide-react';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import NavMenu, { NavMenuItem } from '@/components/layout/nav-menu';
import { useStore } from '@/components/providers/app-store-provider';

export function NavGroupMain({
  items,
  ...props
}: { items: NavMenuItem[] } & React.ComponentPropsWithoutRef<
  typeof SidebarGroup
>) {
  const toggleEditTradeDialog = useStore(
    (state) => state.toggleEditTradeDialog
  );
  const setEditTradeDialogState = useStore(
    (state) => state.setEditTradeDialogState
  );

  const onCreateTradeButtonClick = () => {
    setEditTradeDialogState({ title: 'Add trade' });
    toggleEditTradeDialog(true);
  };

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Create Trade"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
              onClick={onCreateTradeButtonClick}
            >
              <SquarePlusIcon />
              <span>Create Trade</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <NavMenu items={items} />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
