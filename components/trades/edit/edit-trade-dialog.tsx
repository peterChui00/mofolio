'use client';

import { Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';

import { EditTradeInput } from '@/lib/queries/trades';
import { useActivePortfolioId } from '@/hooks/use-active-portfolio-id';
import { useSupabase } from '@/hooks/use-supabase';
import { TradeFormValues, useTradeForm } from '@/hooks/use-trade-form';
import { useAddTrade, useUpdateTrade } from '@/hooks/use-trades';
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
import { usePrefillTradeForm } from '@/components/trades/edit/use-prefill-trade-form';

export default function EditTradeDialog({
  ...props
}: React.ComponentPropsWithoutRef<typeof Dialog>) {
  const supabase = useSupabase();
  const open = useStore((state) => state.isEditTradeDialogOpen);
  const onOpenChange = useStore((state) => state.toggleEditTradeDialog);
  const setEditTradeDialogTab = useStore(
    (state) => state.setEditTradeDialogTab
  );
  const {
    title,
    id,
    symbol,
    notes,
    tags = [],
  } = useStore((state) => state.editTradeDialog);
  const isUpdateTradeMode = !!id;
  const { activePortfolioId } = useActivePortfolioId();

  const tradeForm = useTradeForm();
  const { form } = tradeForm;

  const {
    resetToInitial,
    updateInitial,
    isLoading: isPrefilling,
  } = usePrefillTradeForm({
    enable: isUpdateTradeMode,
    trade: { id, symbol, notes, tags },
    form,
  });

  const addTradeMutation = useAddTrade({ client: supabase });
  const updateTradeMutation = useUpdateTrade({ client: supabase });

  const isSubmitting =
    addTradeMutation.isPending || updateTradeMutation.isPending;
  const submitText = isUpdateTradeMode ? 'Update' : 'Add';
  const submittingText = isUpdateTradeMode ? 'Updating...' : 'Adding...';

  const handleSubmit = (formData: TradeFormValues) => {
    if (!activePortfolioId) {
      throw new Error('No active portfolio ID found');
    }

    const orders = formData.orders.map((order) => ({
      ...order,
      executedAt: order.executedAt.toISOString(),
    }));

    const editTradeInput: EditTradeInput = {
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

    if (isUpdateTradeMode) {
      return updateTradeMutation.mutate(
        { id, ...editTradeInput },
        {
          onSuccess: () => {
            toast.success('Trade successfully updated');
            updateInitial(form.getValues());
          },
          onError: () => toast.error('Failed to update trade'),
        }
      );
    }

    addTradeMutation.mutate(editTradeInput, {
      onSuccess: () => {
        toast.success('Trade successfully created');
        resetToInitial();
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
          isPrefilling={isPrefilling}
        />
        <DialogFooter>
          <Button
            variant="secondary"
            onClick={resetToInitial}
            disabled={isSubmitting || isPrefilling}
          >
            Reset
          </Button>
          <Button
            type="submit"
            onClick={form.handleSubmit(handleSubmit, () => {
              setEditTradeDialogTab('trade');
            })}
            disabled={isSubmitting || isPrefilling}
          >
            {isSubmitting ? (
              <>
                <Loader2Icon className="animate-spin" />
                {submittingText}
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
