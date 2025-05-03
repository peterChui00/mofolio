import React from 'react';

import { Separator } from '@/components/ui/separator';
import SettingsSidebar from '@/components/layout/settings-sidebar';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-1 space-x-2 p-4">
      <SettingsSidebar className="hidden md:block" />
      <Separator orientation="vertical" decorative className="display-gt-sm" />
      <div className="flex-1">{children}</div>
    </div>
  );
}
