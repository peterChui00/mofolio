'use client';

import { TagInGroup } from '@/types';
import { FolderPlusIcon, PlusIcon } from 'lucide-react';
import { toast } from 'sonner';

import { useSupabase } from '@/hooks/use-supabase';
import { useDeleteTag, useDeleteTagGroup, useTags } from '@/hooks/use-tags';
import { useUser } from '@/hooks/use-user';
import { Button } from '@/components/ui/button';
import { useStore } from '@/components/providers/app-store-provider';
import TagGroupCard from '@/components/tags/tag-group-card';

export default function TagManagement() {
  const supabase = useSupabase();
  const user = useUser();
  const userId = user?.id || '';
  const { data: tagGroupWithTags } = useTags({ client: supabase, userId });
  const toggleEditTagGroupDialog = useStore(
    (state) => state.toggleEditTagGroupDialog
  );
  const toggleEditTagDialog = useStore((state) => state.toggleEditTagDialog);
  const toggleConfirmDialog = useStore((state) => state.toggleConfirmDialog);

  const deleteTagMutation = useDeleteTag({ client: supabase });
  const deleteTagGroupMutation = useDeleteTagGroup({ client: supabase });

  const openEditTagGroupDialog = () => {
    toggleEditTagGroupDialog(true);
  };

  const addTag = () => toggleEditTagDialog(true);

  const addTagToGroup = (groupId?: string) => {
    toggleEditTagDialog(true, {
      title: 'Add tag',
      tagGroupId: groupId,
    });
  };

  const updateTag = (tag: TagInGroup & { groupId?: string }) => {
    toggleEditTagDialog(true, {
      title: 'Edit tag',
      tagId: tag.id,
      tagName: tag.name,
      tagGroupId: tag.groupId,
    });
  };

  const deleteTag = (tagId: string) => {
    const toastId = toast.loading('Deleting trade...');
    deleteTagMutation.mutate(tagId, {
      onSuccess: () =>
        toast.success('Tag deleted successfully', { id: toastId }),
      onError: () => toast.error('Failed to delete tag', { id: toastId }),
      onSettled: () => toggleConfirmDialog(false),
    });
  };

  const handleDeleteTag = (tagId: string) => {
    toggleConfirmDialog(true, {
      title: 'Delete tag',
      description:
        'Are you sure you want to delete this tag? This action cannot be undone.',
      confirmVariant: 'destructive',
      onCancel: () => toggleConfirmDialog(false),
      onConfirm: () => deleteTag(tagId),
    });
  };

  const updateTagGroup = (tagGroup: { id: string; name: string }) => {
    toggleEditTagGroupDialog(true, {
      title: 'Edit tag group',
      tagGroupId: tagGroup.id,
      tagGroupName: tagGroup.name,
    });
  };

  const deleteTagGroup = (tagGroupId: string) => {
    const toastId = toast.loading('Deleting tag group...');
    deleteTagGroupMutation.mutate(tagGroupId, {
      onSuccess: () =>
        toast.success('Tag group deleted successfully', { id: toastId }),
      onError: () => toast.error('Failed to delete tag group', { id: toastId }),
      onSettled: () => toggleConfirmDialog(false),
    });
  };

  const handleDeleteTagGroup = (tagGroupId: string) => {
    toggleConfirmDialog(true, {
      title: 'Delete tag group',
      description:
        'Are you sure you want to delete this tag group? This action cannot be undone.',
      confirmVariant: 'destructive',
      onCancel: () => toggleConfirmDialog(false),
      onConfirm: () => deleteTagGroup(tagGroupId),
    });
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between space-x-2">
        <h2 className="display-gt-sm mr-4 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight">
          Tags
        </h2>
        <div className="space-x-2">
          <Button onClick={openEditTagGroupDialog}>
            <FolderPlusIcon />
            Add Group
          </Button>
          <Button onClick={addTag}>
            <PlusIcon />
            Add Tag
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {tagGroupWithTags?.map((tagGroup) => (
          <TagGroupCard
            key={tagGroup.group_id || tagGroup.group_name}
            tagGroup={tagGroup}
            onAddTag={addTagToGroup}
            onUpdateTag={updateTag}
            onDeleteTag={handleDeleteTag}
            onUpdateTagGroup={updateTagGroup}
            onDeleteTagGroup={handleDeleteTagGroup}
          />
        ))}
      </div>
    </div>
  );
}
