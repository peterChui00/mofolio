'use client';

import { ChevronsUpDownIcon, PlusIcon } from 'lucide-react';

import { usePortfolios } from '@/hooks/use-portfolios';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useStore } from '@/components/providers/app-store-provider';

export function PortfolioSwitcher({
  className,
  ...props
}: React.ComponentProps<typeof SidebarMenu>) {
  const { isMobile } = useSidebar();
  const { data: portfolios, isSuccess } = usePortfolios();
  const activePortfolioId = useStore((state) => state.activePortfolioId);
  const setActivePortfolioId = useStore((state) => state.setActivePortfolioId);

  const activePortfolio = (() => {
    if (!isSuccess || !portfolios?.length) {
      return { id: 'unknown', name: '', base_currency: '' };
    }

    if (activePortfolioId) {
      const foundPortfolio = portfolios.find(
        (portfolio) => portfolio.id === activePortfolioId
      );
      if (foundPortfolio) {
        return foundPortfolio;
      }
    }

    return portfolios[0];
  })();

  return (
    <SidebarMenu className={className} {...props}>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              tooltip={activePortfolio.name}
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                {/* <activePortfolio.icon className="size-4" /> */}
                {activePortfolio.name[0]}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activePortfolio.name}
                </span>
                <span className="truncate text-xs">
                  {activePortfolio.base_currency}
                </span>
              </div>
              <ChevronsUpDownIcon className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Portfolios
            </DropdownMenuLabel>
            {isSuccess &&
              portfolios.map((portfolio) => (
                <DropdownMenuItem
                  key={portfolio.id}
                  onClick={() => setActivePortfolioId(portfolio.id)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    {/* <activePortfolio.icon className="size-4 shrink-0" /> */}
                    {portfolio.name[0]}
                  </div>
                  {portfolio.name}
                </DropdownMenuItem>
              ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                <PlusIcon className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">
                Add portfolio
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
