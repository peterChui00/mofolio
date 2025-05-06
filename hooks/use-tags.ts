import { TypeSupabaseClient } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

import {
  addTag,
  addTagGroup,
  deleteTag,
  deleteTagGroup,
  getTags,
  updateTag,
  updateTagGroup,
  UpdateTagInput,
} from '@/lib/queries/tags';
import { getQueryClient } from '@/components/providers/query-provider';

export const getTagsQueryParams = (
  client: TypeSupabaseClient,
  userId: string
) => ({
  queryKey: ['tags'],
  queryFn: () => getTags(client, userId).then((res) => res.data),
});

export function useTags({
  client,
  userId,
}: {
  client: TypeSupabaseClient;
  userId: string;
}) {
  return useQuery({
    ...getTagsQueryParams(client, userId),
    enabled: !!userId,
  });
}

export function useAddTag({
  client,
  userId,
}: {
  client: TypeSupabaseClient;
  userId: string;
}) {
  return useMutation({
    mutationFn: (tag: { name: string; groupId?: string | null }) =>
      addTag(client, {
        name: tag.name,
        groupId: tag.groupId,
        userId,
      }),
    onSuccess: () => {
      getQueryClient().invalidateQueries({
        queryKey: ['tags'],
      });
    },
    onError: (error) => console.error(error),
  });
}
export function useUpdateTag({ client }: { client: TypeSupabaseClient }) {
  return useMutation({
    mutationFn: (tag: UpdateTagInput) => updateTag(client, tag),
    onSuccess: () => {
      getQueryClient().invalidateQueries({
        queryKey: ['tags'],
      });
    },
    onError: (error) => console.error(error),
  });
}

export function useDeleteTag({ client }: { client: TypeSupabaseClient }) {
  return useMutation({
    mutationFn: (tagId: string) => deleteTag(client, tagId),
    onSuccess: () => {
      getQueryClient().invalidateQueries({
        queryKey: ['tags'],
      });
    },
    onError: (error) => console.error(error),
  });
}

export function useAddTagGroup({
  client,
  userId,
}: {
  client: TypeSupabaseClient;
  userId: string;
}) {
  return useMutation({
    mutationFn: (tagGroup: { name: string }) =>
      addTagGroup(client, {
        userId,
        name: tagGroup.name,
      }),
    onSuccess: () => {
      getQueryClient().invalidateQueries({
        queryKey: ['tags'],
      });
    },
    onError: (error) => console.error(error),
  });
}

export function useUpdateTagGroup({ client }: { client: TypeSupabaseClient }) {
  return useMutation({
    mutationFn: (tagGroup: { id: string; name: string }) =>
      updateTagGroup(client, {
        id: tagGroup.id,
        name: tagGroup.name,
      }),
    onSuccess: () => {
      getQueryClient().invalidateQueries({
        queryKey: ['tags'],
      });
    },
    onError: (error) => console.error(error),
  });
}

export function useDeleteTagGroup({ client }: { client: TypeSupabaseClient }) {
  return useMutation({
    mutationFn: (tagGroupId: string) => deleteTagGroup(client, tagGroupId),
    onSuccess: () => {
      getQueryClient().invalidateQueries({
        queryKey: ['tags'],
      });
    },
    onError: (error) => console.error(error),
  });
}
