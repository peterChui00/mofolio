'use client';

import {
  LayoutDashboardIcon,
  LucideIcon,
  NotebookIcon,
  ReceiptTextIcon,
  SettingsIcon,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { NavGroupMain } from '@/components/layout/nav-group-main';
import { NavGroupSecondary } from '@/components/layout/nav-group-secondary';
import { NavUser } from '@/components/layout/nav-user';

export type NavMenuItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
};

const navData: Record<string, NavMenuItem[]> = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboardIcon,
    },
    {
      title: 'Trades',
      url: '/trades',
      icon: ReceiptTextIcon,
    },
    {
      title: 'Journal',
      url: '/journal',
      icon: NotebookIcon,
    },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '/settings',
      icon: SettingsIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarTrigger className="w-8" />
      </SidebarHeader>
      <SidebarContent>
        <NavGroupMain items={navData.navMain} />
        <NavGroupSecondary items={navData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
