'use client';

import { SidebarGroup, SidebarGroupContent } from '@/components/ui/sidebar';
import { NavMenuItem } from '@/components/layout/app-sidebar';
import NavMenu from '@/components/layout/nav-menu';

export function NavGroupSecondary({
  items,
  ...props
}: {
  items: NavMenuItem[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <NavMenu items={items} />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
