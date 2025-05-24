import JournalSidebar from '@/components/journal/journal-sidebar';

export default function JournalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex size-full flex-1">
      <JournalSidebar />
      <main className="flex flex-1 flex-col overflow-auto p-4">{children}</main>
    </div>
  );
}
