import { CalendarIcon, Filter, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AddEntryButton from '@/components/journal/add-entry-button';

export function JournalToolbar() {
  return (
    <div className="bg-background flex items-center justify-between pb-2">
      <div className="relative w-96">
        <Search className="text-muted-foreground absolute top-2.5 left-2.5 size-4" />
        <Input
          type="search"
          placeholder="Search journal entries..."
          className="bg-background w-full pl-8"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline">
          <CalendarIcon />
          Today
        </Button>

        <Button variant="outline">
          <Filter />
          Filter
        </Button>

        <AddEntryButton />
      </div>
    </div>
  );
}
