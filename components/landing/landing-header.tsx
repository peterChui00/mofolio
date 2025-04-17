'use client';

import React from 'react';
import Link from 'next/link';

import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/hooks/use-user';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import UserAvatar from '@/components/layout/user-avatar';

export default function LandingHeader() {
  const user = useUser();
  const logout = () => createClient().auth.signOut();

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Icons.logo className="text-primary size-6" />
          <span className="text-xl font-bold">Mofolio</span>
        </Link>
        <nav>
          {user ? (
            <div className="ml-auto flex items-center gap-4">
              <Button onClick={logout} size="sm">
                Logout
              </Button>
              <Link href="/dashboard">
                <UserAvatar
                  name={user.user_metadata.name}
                  avatar={user.user_metadata.avatar_url}
                />
              </Link>
            </div>
          ) : (
            <Button asChild size="sm">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
