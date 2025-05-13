'use client';

import { FieldArrayWithId, UseFormReturn } from 'react-hook-form';

import { TradeFormValues, useTradeForm } from '@/hooks/use-trade-form';
import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStore } from '@/components/providers/app-store-provider';
import NotesTabContent from '@/components/trades/edit/notes-tab-content';
import TradeTabContent from '@/components/trades/edit/trade-tab-content';

const tabsTriggerClassName =
  'hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:border-none data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:data-[state=active]:bg-transparent';

export type FormOrderLayoutProps = {
  form: UseFormReturn<TradeFormValues>;
  fields: FieldArrayWithId<TradeFormValues, 'orders', 'id'>[];
  onAppend: () => void;
  onRemove: (index: number) => void;
};

type EditTradeFromProps = {
  tradeForm: ReturnType<typeof useTradeForm>;
  className?: string;
  isPrefilling?: boolean;
} & React.ComponentPropsWithoutRef<'form'>;

export default function EditTradeForm({
  tradeForm,
  className,
  isPrefilling,
  onSubmit,
  ...props
}: EditTradeFromProps) {
  const tab = useStore((state) => state.editTradeDialog.tab);
  const setEditTradeDialogTab = useStore(
    (state) => state.setEditTradeDialogTab
  );
  const { form } = tradeForm;

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className={className} {...props}>
        <Tabs
          value={tab}
          onValueChange={setEditTradeDialogTab}
          className="gap-4"
        >
          <TabsList className="text-foreground h-auto w-full gap-2 rounded-none border-b bg-transparent px-0 py-1">
            <TabsTrigger value="trade" className={tabsTriggerClassName}>
              Trade
            </TabsTrigger>
            <TabsTrigger value="notes" className={tabsTriggerClassName}>
              Notes
            </TabsTrigger>
          </TabsList>
          <TabsContent value="trade" className="space-y-4">
            <TradeTabContent
              tradeForm={tradeForm}
              isPrefilling={isPrefilling}
            />
          </TabsContent>
          <TabsContent value="notes" className="space-y-4">
            <NotesTabContent tradeForm={tradeForm} />
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}
