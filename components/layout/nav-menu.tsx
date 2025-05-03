'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon } from 'lucide-react';

import {
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export type NavMenuItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  badge?: React.ReactNode;
  isActive?: boolean;
};

export default function NavMenu({
  items,
  ...props
}: {
  items: NavMenuItem[];
} & React.ComponentPropsWithoutRef<typeof SidebarMenu>) {
  const pathname = usePathname();

  return (
    <SidebarMenu {...props}>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            tooltip={item.title}
            asChild
            isActive={item.isActive || pathname.startsWith(item.url)}
          >
            <Link href={item.url}>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
          {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
