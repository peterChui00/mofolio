'use client';

import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { AddTradeInput } from '@/lib/queries/trades';
import { useActivePortfolioId } from '@/hooks/use-active-portfolio-id';
import { useSupabase } from '@/hooks/use-supabase';
import { TradeFormValues, useTradeForm } from '@/hooks/use-trade-form';
import { useAddTrade } from '@/hooks/use-trades';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useStore } from '@/components/providers/app-store-provider';
import EditTradeForm from '@/components/trades/edit/edit-trade-form';

export default function EditTradeDialog({
  ...props
}: React.ComponentPropsWithoutRef<typeof Dialog>) {
  const supabase = useSupabase();
  const open = useStore((state) => state.isEditTradeDialogOpen);
  const onOpenChange = useStore((state) => state.toggleEditTradeDialog);
  const setEditTradeDialogTab = useStore(
    (state) => state.setEditTradeDialogTab
  );
  const { title, id } = useStore((state) => state.editTradeDialog);
  const { activePortfolioId } = useActivePortfolioId();

  const tradeForm = useTradeForm();
  const { form } = tradeForm;

  const addTradeMutation = useAddTrade({ client: supabase });

  const isLoading = addTradeMutation.isPending;
  const isUpdateTradeMode = !!id;
  const submitText = isUpdateTradeMode ? 'Update' : 'Add';
  const sumbittingText = isUpdateTradeMode ? 'Updating...' : 'Adding...';

  const handleSubmit = (formData: TradeFormValues) => {
    if (!activePortfolioId) {
      throw new Error('No active portfolio ID found');
    }

    const orders = formData.orders.map((order) => ({
      ...order,
      executedAt: order.executedAt.toISOString(),
    }));
    const addTradeInput: AddTradeInput = {
      ...formData,
      portfolioId: activePortfolioId,
      symbol: formData.symbol.toUpperCase(),
      side: formData.side ?? 'LONG',
      openedAt: orders[0].executedAt,
      closedAt:
        orders.reduce((acc, cur) => acc + cur.quantity, 0) === 0
          ? orders[orders.length - 1].executedAt
          : undefined,
      orders,
    };

    addTradeMutation.mutate(addTradeInput, {
      onSuccess: () => {
        toast.success('Trade successfully created');
        form.reset();
      },
      onError: () => toast.error('Failed to create trade'),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} {...props}>
      <DialogContent className="flex max-h-[80dvh] flex-col md:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <EditTradeForm
          className="-mx-6 overflow-y-auto px-6"
          tradeForm={tradeForm}
        />
        <DialogFooter>
          <Button variant="secondary" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button
            type="submit"
            onClick={form.handleSubmit(handleSubmit, () => {
              setEditTradeDialogTab('trade');
            })}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                {sumbittingText}
              </>
            ) : (
              submitText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
