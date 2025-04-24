import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { useActivePortfolioId } from '@/hooks/use-active-portfolio-id';
import {
  EditTradeFormValues,
  useEditTradeForm,
} from '@/hooks/use-edit-trade-form';
import { useAddOrder } from '@/hooks/use-order';
import { useSupabase } from '@/hooks/use-supabase';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import EditTradeForm from '@/components/trades/edit/edit-trade-form';

export default function EditTradeDialog({
  title,
  ...props
}: {
  title?: string;
} & React.ComponentPropsWithoutRef<typeof Dialog>) {
  const form = useEditTradeForm();
  const supabase = useSupabase();
  const { activePortfolioId } = useActivePortfolioId();
  const addOrderMutation = useAddOrder({ client: supabase });
  const isLoading = addOrderMutation.isPending;

  const handleSubmit = (formData: EditTradeFormValues) => {
    if (!activePortfolioId) {
      throw new Error('No active portfolio ID found');
    }

    const addOrderInput = {
      ...formData,
      portfolioId: activePortfolioId,
    };
    addOrderMutation.mutate(addOrderInput, {
      onSuccess: (order) => {
        toast.success('Trade successfully created', {
          action: (
            <Button asChild className="ml-auto h-6 w-20 text-xs">
              <Link href={'/trades/' + order.trade_id}>View Trade</Link>
            </Button>
          ),
        });
        form.reset();
      },
    });
  };

  return (
    <Dialog {...props}>
      <DialogContent className="flex max-h-[80dvh] flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <EditTradeForm
          className="-mx-6 grid grid-cols-12 gap-4 overflow-y-auto px-6"
          form={form}
          onSubmit={form.handleSubmit(handleSubmit)}
        />
        <DialogFooter>
          <Button
            type="submit"
            onClick={form.handleSubmit(handleSubmit)}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                {'Submitting...'}
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
