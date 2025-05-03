'use client';

import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sidebar, SidebarContent } from '@/components/ui/sidebar';
import NavMenu, { NavMenuItem } from '@/components/layout/nav-menu';

const navItems = [
  // {
  //   title: 'Account',
  //   url: '/settings/account',
  // },
  // {
  //   title: 'Appearance',
  //   url: '/settings/appearance',
  // },
  // {
  //   title: 'Billing',
  //   url: '/settings/billing',
  // },
  {
    title: 'Tags',
    url: '/settings/tags',
  },
];

export default function SettingsSidebar({
  className,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const isMobile = useIsMobile();
  const pathname = usePathname();

  const profileNavItem: NavMenuItem = {
    title: 'Profile',
    url: '/settings/profile',
    isActive: !isMobile && pathname === '/settings',
  };

  return (
    <Sidebar
      collapsible="none"
      className={cn('bg-background', className)}
      {...props}
    >
      <SidebarContent>
        <NavMenu items={[profileNavItem, ...navItems]} />
      </SidebarContent>
    </Sidebar>
  );
}
