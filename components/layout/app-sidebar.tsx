'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Notebook,
  ReceiptText,
  SquarePlus,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useStore } from '@/components/layout/app-store-provider';
import AddTradeDialog from '@/components/trades/add-trade-dialog';

// Menu items
const items = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Trades',
    url: '/trades',
    icon: ReceiptText,
  },
  {
    title: 'Journal',
    url: '/journal',
    icon: Notebook,
  },
];

export function AppSidebar({ ...props }) {
  const isAddTradeDialogOpen = useStore((state) => state.isAddTradeDialogOpen);
  const toggleAddTradeDialog = useStore((state) => state.toggleAddTradeDialog);
  const pathname = usePathname();

  const onAddTradeDialogOpenChange = (open: boolean) =>
    toggleAddTradeDialog(open);

  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <SidebarTrigger className="w-8" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={pathname.startsWith(item.url)}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={'Add Trade'}
                onClick={() => toggleAddTradeDialog()}
              >
                <button>
                  <SquarePlus />
                  <span>Add Trade</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <AddTradeDialog
        open={isAddTradeDialogOpen}
        onOpenChange={onAddTradeDialogOpenChange}
      />
    </>
  );
}
