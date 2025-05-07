'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useSupabase } from '@/hooks/use-supabase';
import { useAddTagGroup, useUpdateTagGroup } from '@/hooks/use-tags';
import { useUser } from '@/hooks/use-user';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useStore } from '@/components/providers/app-store-provider';

const tagGroupFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Group name is required')
    .max(30, 'Group name must be less than 30 characters'),
});

type TagGroupFormValues = z.infer<typeof tagGroupFormSchema>;

export default function EditTagGroupDialog({
  ...props
}: React.ComponentPropsWithoutRef<typeof Dialog>) {
  const supabase = useSupabase();
  const user = useUser();
  const userId = user?.id || '';
  const open = useStore((state) => state.isEditTagGroupDialogOpen);
  const onOpenChange = useStore((state) => state.toggleEditTagGroupDialog);
  const { title, tagGroupId, tagGroupName } = useStore(
    (state) => state.editTagGroupDialog
  );

  const form = useForm<TagGroupFormValues>({
    resolver: zodResolver(tagGroupFormSchema),
    defaultValues: {
      name: tagGroupName || '',
    },
  });

  const addTagGroupMutation = useAddTagGroup({ client: supabase, userId });
  const updateTagGroupMutation = useUpdateTagGroup({ client: supabase });

  useEffect(() => {
    // Set default values
    form.setValue('name', tagGroupName || '');
  }, [form, tagGroupName]);

  const isLoading =
    addTagGroupMutation.isPending || updateTagGroupMutation.isPending;
  const isUpdateTagGroupMode = tagGroupId && tagGroupName;
  const submitText = isUpdateTagGroupMode ? 'Update' : 'Add';
  const sumbittingText = isUpdateTagGroupMode ? 'Updating...' : 'Adding...';

  const handleSubmit = (formData: TagGroupFormValues) => {
    if (isUpdateTagGroupMode) {
      return updateTagGroupMutation.mutate(
        {
          id: tagGroupId,
          name: formData.name,
        },
        {
          onSuccess: () => {
            toast.success('Tag group successfully updated');
            form.reset();
            onOpenChange(false);
          },
          onError: () => toast.error('Failed to update tag group'),
        }
      );
    }

    addTagGroupMutation.mutate(formData, {
      onSuccess: () => {
        toast.success('Tag group successfully added');
        form.reset();
        onOpenChange(false);
      },
      onError: () => toast.error('Failed to add tag group'),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} {...props}>
      <DialogContent className="flex max-h-[80dvh] flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem {...props}>
                  <FormLabel>Group Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button
            type="submit"
            onClick={form.handleSubmit(handleSubmit)}
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
