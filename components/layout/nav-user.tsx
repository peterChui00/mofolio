'use client';

import Link from 'next/link';
import {
  CircleHelpIcon,
  LogInIcon,
  LogOutIcon,
  MessageCircleWarningIcon,
  MoreVerticalIcon,
  UserIcon,
} from 'lucide-react';

import { createClient } from '@/lib/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useStore } from '@/components/layout/app-store-provider';
import UserAvatar from '@/components/layout/user-avatar';

export function NavUser() {
  const { isMobile } = useSidebar();
  const user = useStore((state) => state.user);
  const isAuthLoading = useStore((state) => state.isAuthLoading);

  const username: string = user?.user_metadata.name ?? 'Anonymous';
  const userAvatar: string | undefined = user?.user_metadata.avatar_url;

  const logout = () => createClient().auth.signOut();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserAvatar
                name={username}
                avatar={userAvatar}
                avatarFallback={!user && <UserIcon />}
                loading={isAuthLoading}
              />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {isAuthLoading ? (
                    <Skeleton className="h-4 w-3/4" />
                  ) : (
                    username
                  )}
                </span>
              </div>
              <MoreVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <CircleHelpIcon />
                Help
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageCircleWarningIcon />
                Send feedback
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {user ? (
              <DropdownMenuItem onClick={logout}>
                <LogOutIcon />
                Logout
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem asChild>
                <Link href="/login">
                  <LogInIcon />
                  Login
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
