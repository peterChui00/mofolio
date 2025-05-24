'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useActivePortfolioId } from '@/hooks/use-active-portfolio-id';
import { useAddJournalEntry } from '@/hooks/use-journal-entries';
import { useSupabase } from '@/hooks/use-supabase';
import { useUserId } from '@/hooks/use-user-id';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useStore } from '@/components/providers/app-store-provider';
import DateFormField from '@/components/trades/edit/date-form-field';
import InputFormField from '@/components/trades/edit/input-form-field';

const journalEntryFormSchema = z.object({
  title: z.string().min(1, 'Required'),
  content: z.string().optional(),
  date: z.date().nullable().optional(),
  folderId: z.string().nullable().optional(),
});

export type JournalEntryFormValues = z.infer<typeof journalEntryFormSchema>;

export default function EditJournalEntryDialog() {
  const client = useSupabase();
  const userId = useUserId();
  const { activePortfolioId = '' } = useActivePortfolioId();
  const open = useStore((state) => state.isEditJournalEntryDialogOpen);
  const onOpenChange = useStore((state) => state.toggleEditJournalEntryDialog);
  const { title } = useStore((state) => state.editJournalEntryDialog);

  const form = useForm<JournalEntryFormValues>({
    resolver: zodResolver(journalEntryFormSchema),
  });

  const addJournalEntryMutation = useAddJournalEntry({ client });

  const isLoading = addJournalEntryMutation.isPending;
  const submitText = 'Add';
  const submittingText = 'Adding...';

  const handleSubmit = async (formData: JournalEntryFormValues) => {
    const input = {
      ...formData,
      userId,
      portfolioId: activePortfolioId,
      date: formData.date?.toISOString(),
    };
    addJournalEntryMutation.mutate(input, {
      onSuccess: () => {
        toast.success('Journal entry successfully added');
        form.reset();
        onOpenChange(false);
      },
      onError: () => toast.error('Failed to add journal entry'),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[80dvh] flex-col">
        <DialogTitle>{title}</DialogTitle>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="-mx-6 grid gap-4 overflow-y-auto px-6"
          >
            <InputFormField form={form} name="title" label="Title" />
            <DateFormField form={form} name="date" label="Date" />
          </form>
        </Form>

        <DialogFooter>
          <Button onClick={form.handleSubmit(handleSubmit)}>
            {isLoading ? (
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
