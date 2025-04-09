import React from 'react';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

export default function UserAvatar({
  name,
  avatar,
  avatarFallback,
  loading,
  className,
  ...props
}: {
  name: string;
  avatar?: string;
  avatarFallback?: React.ReactNode;
  loading?: boolean;
} & React.ComponentProps<typeof Avatar>) {
  if (loading) {
    return <Skeleton className={cn('size-8 rounded-lg', className)} />;
  }

  const initials = name
    ?.split(' ')
    ?.map((word) => word[0])
    ?.join('')
    ?.toUpperCase();

  return (
    <Avatar className={cn('size-8 rounded-lg', className)} {...props}>
      <AvatarImage src={avatar} alt={name} />
      <AvatarFallback className="rounded-lg">
        {avatarFallback || initials}
      </AvatarFallback>
    </Avatar>
  );
}
