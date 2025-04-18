import { promises as fs } from 'fs';
import { cookies } from 'next/headers';
import { Trade } from '@/types';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import ActivePortfolioIdProvider from '@/components/providers/active-portfolio-id-provider';
import DemoDataProvider from '@/components/providers/demo-data-provider';
import DialogProvider from '@/components/providers/dialog-provider';
import PortfolioProvider from '@/components/providers/portfolio-provider';

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
    <PortfolioProvider>
      <ActivePortfolioIdProvider />
      <SidebarProvider defaultOpen={defaultOpen} className="h-svh">
        <AppSidebar variant="inset" />
        <SidebarInset>
          <main className="flex size-full flex-1 flex-col">{children}</main>
        </SidebarInset>
        <DemoDataProvider data={demoData} />
        <DialogProvider />
      </SidebarProvider>
    </PortfolioProvider>
  );
}
