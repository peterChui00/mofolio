import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeftIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Settings',
};

export default function TagsSettingsPage() {
  return (
    <div className="space-y-4">
      <Button variant="link" asChild className="md:hidden">
        <Link href="/settings" className="flex">
          <ChevronLeftIcon />
          Tags
        </Link>
      </Button>

      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight">
        Tags
      </h2>
    </div>
  );
}
