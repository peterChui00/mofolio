'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useSupabase } from '@/hooks/use-supabase';
import { useAddTag, useTags, useUpdateTag } from '@/hooks/use-tags';
import { useUserId } from '@/hooks/use-user-id';
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
import TagGroupFormField from '@/components/tags/tag-group-form-field';

const tagFromSchema = z.object({
  name: z
    .string()
    .min(1, 'Tag name is required')
    .max(30, 'Tag name must be less than 30 characters'),
  groupId: z.string().nullable().optional(),
});

export type TagFormValues = z.infer<typeof tagFromSchema>;

export default function EditTagDialog({
  ...props
}: React.ComponentPropsWithoutRef<typeof Dialog>) {
  const supabase = useSupabase();
  const userId = useUserId();
  const open = useStore((state) => state.isEditTagDialogOpen);
  const onOpenChange = useStore((state) => state.toggleEditTagDialog);
  const { title, tagId, tagName, tagGroupId } = useStore(
    (state) => state.editTagDialog
  );

  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagFromSchema),
    defaultValues: {
      name: tagName || '',
      groupId: tagGroupId,
    },
  });

  const { data: tagGroupsWithTags } = useTags({ client: supabase, userId });

  const addTagMutation = useAddTag({ client: supabase, userId });
  const updateTagMutation = useUpdateTag({ client: supabase });

  useEffect(() => {
    // Set default values
    form.setValue('name', tagName || '');
    form.setValue('groupId', tagGroupId);
  }, [form, tagName, tagGroupId]);

  const isLoading = addTagMutation.isPending || updateTagMutation.isPending;
  const isAddTagToGroupMode = !tagId && !!tagGroupId;
  const isUpdateTagMode = tagId && tagName;
  const submitText = isUpdateTagMode ? 'Update' : 'Add';
  const sumbittingText = isUpdateTagMode ? 'Updating...' : 'Adding...';

  const handleSubmit = (formData: TagFormValues) => {
    if (isUpdateTagMode) {
      return updateTagMutation.mutate(
        {
          id: tagId,
          name: formData.name,
          groupId: formData.groupId,
        },
        {
          onSuccess: () => {
            toast.success('Tag successfully updated');
            form.reset();
            onOpenChange(false);
          },
          onError: () => toast.error('Failed to update tag'),
        }
      );
    }

    addTagMutation.mutate(formData, {
      onSuccess: () => {
        toast.success('Tag successfully added');
        form.reset();
        onOpenChange(false);
      },
      onError: () => toast.error('Failed to add tag'),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} {...props}>
      <DialogContent className="flex max-h-[80dvh] flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="-mx-6 grid gap-4 overflow-y-auto px-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem {...props}>
                  <FormLabel>Tag Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <TagGroupFormField
              form={form}
              data={tagGroupsWithTags}
              disabled={isAddTagToGroupMode}
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
