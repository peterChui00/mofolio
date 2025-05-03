'use client';

import { SidebarGroup, SidebarGroupContent } from '@/components/ui/sidebar';
import NavMenu, { NavMenuItem } from '@/components/layout/nav-menu';

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
