import { promises as fs } from 'fs';
import { cookies } from 'next/headers';
import { Trade } from '@/types';

import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import DemoDataProvider from '@/components/layout/demo-data-provider';

export default async function MainAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  // Load demo data
  const demoDataJsonfile = await fs.readFile(
    process.cwd() + '/data/demo-data.json',
    'utf8'
  );
  const demoData: Trade[] = JSON.parse(demoDataJsonfile);

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className="flex h-dvh w-full flex-1 flex-col">{children}</main>
      <DemoDataProvider data={demoData} />
    </SidebarProvider>
  );
}
