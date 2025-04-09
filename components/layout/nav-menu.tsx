import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { NavMenuItem } from '@/components/layout/app-sidebar';

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
            isActive={pathname.startsWith(item.url)}
          >
            <Link href={item.url}>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
