import { TagGroupWithTags, TypeSupabaseClient } from '@/types';

import { removeUndefined } from '@/lib/utils';

export const getTags = async (client: TypeSupabaseClient, userId: string) => {
  return client
    .rpc('get_tags_grouped', {
      uid: userId,
    })
    .select()
    .overrideTypes<TagGroupWithTags[], { merge: false }>()
    .throwOnError();
};

export type AddTagInput = {
  name: string;
  userId: string;
  groupId?: string | null;
};

export const addTag = async (client: TypeSupabaseClient, tag: AddTagInput) => {
  return client
    .from('tags')
    .insert({
      name: tag.name,
      user_id: tag.userId,
      group_id: tag.groupId,
    })
    .throwOnError();
};

export type UpdateTagInput = {
  id: string;
  name?: string;
  groupId?: string | null;
};

export const updateTag = async (
  client: TypeSupabaseClient,
  tag: UpdateTagInput
) => {
  const updateValues = removeUndefined({
    name: tag.name,
    group_id: tag.groupId,
  });

  return client
    .from('tags')
    .update(updateValues)
    .eq('id', tag.id)
    .throwOnError();
};

export const deleteTag = async (client: TypeSupabaseClient, tagId: string) => {
  return client.from('tags').delete().eq('id', tagId).throwOnError();
};

export const addTagGroup = async (
  client: TypeSupabaseClient,
  tagGroup: { name: string; userId: string }
) => {
  return client
    .from('tag_groups')
    .insert({
      user_id: tagGroup.userId,
      name: tagGroup.name,
    })
    .throwOnError();
};

export type UpdateTagGroupInput = {
  id: string;
  name?: string;
};

export const updateTagGroup = async (
  client: TypeSupabaseClient,
  tagGroup: UpdateTagGroupInput
) => {
  const updateValues = removeUndefined({
    name: tagGroup.name,
  });

  return client
    .from('tag_groups')
    .update(updateValues)
    .eq('id', tagGroup.id)
    .throwOnError();
};

export const deleteTagGroup = async (
  client: TypeSupabaseClient,
  tagGroupId: string
) => {
  return client.from('tag_groups').delete().eq('id', tagGroupId).throwOnError();
};
