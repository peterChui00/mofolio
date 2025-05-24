'use client';

import {
  ArrowDownIcon,
  ArrowUpIcon,
  CalendarIcon,
  DollarSignIcon,
  LineChartIcon,
  PenIcon,
  PercentIcon,
  StarIcon,
  Trash2Icon,
} from 'lucide-react';

import { useJournalEntry } from '@/hooks/use-journal-entries';
import { useSupabase } from '@/hooks/use-supabase';
import { useTags } from '@/hooks/use-tags';
import { useUserId } from '@/hooks/use-user-id';
import { Card, CardContent } from '@/components/ui/card';
import { TagSelector } from '@/components/tag-selector';

export default function JournalEntryHeader({ id }: { id: string }) {
  const client = useSupabase();
  const userId = useUserId();

  const { data: journalEntry } = useJournalEntry({
    client,
    entryId: id,
  });

  const { data: tagGroupsWithTags, isLoading: isTagLoading } = useTags({
    client,
    userId,
  });

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{journalEntry?.title}</h1>

          {journalEntry?.date && (
            <div className="text-muted-foreground flex items-center">
              <CalendarIcon className="mr-1 size-4" />
              <span>{journalEntry.date}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <PenIcon className="text-muted-foreground size-5 cursor-pointer" />
          <StarIcon className="text-muted-foreground size-5 cursor-pointer transition-colors hover:text-yellow-400" />
          <Trash2Icon className="text-muted-foreground size-5 cursor-pointer" />
        </div>
      </div>

      <TagSelector
        className="w-full"
        tagGroups={tagGroupsWithTags || []}
        isLoading={isTagLoading}
      />

      <div className="grid grid-cols-3 gap-4">
        <MetricCard
          title="Win Rate"
          value={`${62.5}%`}
          icon={<PercentIcon className="h-4 w-4" />}
          trend="up"
          trendValue="+5.2%"
        />
        <MetricCard
          title="Profit/Loss"
          value={`$${1250.75}`}
          icon={<DollarSignIcon className="h-4 w-4" />}
          trend="up"
          trendValue="+$450.25"
        />
        <MetricCard
          title="Total Trades"
          value={'8'}
          icon={<LineChartIcon className="h-4 w-4" />}
          trend="down"
          trendValue="-2"
        />
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
  trend,
  trendValue,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: 'up' | 'down';
  trendValue: string;
}) {
  return (
    <Card>
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className="bg-primary/10 rounded-full p-2">{icon}</div>
        </div>
        <div className="mt-2 flex items-center">
          {trend === 'up' ? (
            <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
          ) : (
            <ArrowDownIcon className="mr-1 h-4 w-4 text-red-500" />
          )}
          <span
            className={
              trend === 'up' ? 'text-sm text-green-500' : 'text-sm text-red-500'
            }
          >
            {trendValue} vs yesterday
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
