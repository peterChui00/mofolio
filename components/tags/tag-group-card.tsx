import { TagGroupWithTags, TagInGroup } from '@/types';
import { PenLineIcon, PlusIcon, Trash2Icon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function TagGroupCard({
  tagGroup,
  onAddTag = () => {},
  onUpdateTag = () => {},
  onDeleteTag = () => {},
  onUpdateTagGroup = () => {},
  onDeleteTagGroup = () => {},
}: {
  tagGroup: TagGroupWithTags;
  onAddTag?: (tagGroupId: string) => void;
  onUpdateTag?: (tag: TagInGroup & { groupId?: string }) => void;
  onDeleteTag?: (tagId: string) => void;
  onUpdateTagGroup?: (tagGroup: { id: string; name: string }) => void;
  onDeleteTagGroup?: (tagGroupId: string) => void;
}) {
  const { group_id, group_name, tags } = tagGroup;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{group_name}</CardTitle>
        {group_id !== 'ungrouped' && (
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Edit ${group_name} group`}
              onClick={() =>
                onUpdateTagGroup({ id: group_id, name: group_name })
              }
            >
              <PenLineIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Delete ${group_name} group`}
              onClick={() => onDeleteTagGroup(group_id)}
            >
              <Trash2Icon />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {tags && tags.length > 0 ? (
          <div className="space-y-3">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex w-full items-center justify-between"
              >
                <Badge className="max-w-[70%] px-3 py-1 break-words whitespace-normal">
                  {tag.name}
                </Badge>
                <div className="ml-2 flex shrink-0 space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    aria-label={`Edit ${tag.name} tag`}
                    onClick={() => onUpdateTag({ ...tag, groupId: group_id })}
                  >
                    <PenLineIcon />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    aria-label={`Delete ${tag.name} tag`}
                    onClick={() => onDeleteTag(tag.id)}
                  >
                    <Trash2Icon />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center text-sm">
            No tags in this group
          </p>
        )}
      </CardContent>
      <CardFooter className="mt-auto">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onAddTag(tagGroup.group_id)}
        >
          <PlusIcon />
          Add Tag
        </Button>
      </CardFooter>
    </Card>
  );
}
