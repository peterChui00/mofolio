import { ActivityIcon, ChartLineIcon, NotebookPenIcon } from 'lucide-react';

import LandingHeader from '@/components/landing/landing-header';

export default async function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />

      {/* Hero Section */}
      <main className="flex-1">
        <section className="from-background to-primary/5 relative w-full overflow-hidden bg-gradient-to-b py-12 md:py-24 lg:py-32 xl:py-48">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden opacity-30">
            <div className="bg-primary/20 absolute top-10 -left-4 h-72 w-72 rounded-full blur-3xl"></div>
            <div className="bg-primary/20 absolute top-40 right-10 h-72 w-72 rounded-full blur-3xl"></div>
          </div>

          <div className="relative container px-4 md:px-6">
            <div className="mx-auto max-w-4xl text-center">
              <div className="animate-fade-in bg-primary/10 text-primary ring-primary/20 mb-6 inline-block rounded-full px-4 py-2 text-sm font-medium ring-1 ring-inset">
                Coming Soon
              </div>
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Streamline Your{' '}
                <span className="text-primary">Trading Journey</span>
              </h1>
              <p className="text-muted-foreground mx-auto max-w-[800px] text-xl md:text-2xl">
                Plan, analyze, and journal your trades in one powerful platform
                designed for serious traders.
              </p>

              <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
                <div className="bg-background/80 flex items-center rounded-full px-4 py-2 text-sm backdrop-blur-sm">
                  <ChartLineIcon className="mr-2 size-5" />
                  <span>Advanced Analytics</span>
                </div>
                <div className="bg-background/80 flex items-center rounded-full px-4 py-2 text-sm backdrop-blur-sm">
                  <NotebookPenIcon className="mr-2 size-5" />
                  <span>Trade Journaling</span>
                </div>
                <div className="bg-background/80 flex items-center rounded-full px-4 py-2 text-sm backdrop-blur-sm">
                  <ActivityIcon className="mr-2 size-5" />
                  <span>Performance Tracking</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t px-4 py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Mofolio.
          </p>
        </div>
      </footer>
    </div>
  );
}
