'use client';

import { useMemo, useState } from 'react';
import { TagGroupWithTags } from '@/types';
import { CheckIcon, Loader2Icon } from 'lucide-react';

import {
  Tags,
  TagsContent,
  TagsEmpty,
  TagsGroup,
  TagsInput,
  TagsItem,
  TagsList,
  TagsTrigger,
  TagsValue,
} from '@/components/tags';

export type TagSelectorProps = {
  tagGroups: TagGroupWithTags[];
  selectedTags?: string[];
  onSelectionChange?: (selectedTags: string[]) => void;
  defaultSelectedTags?: string[];
  placeholder?: string;
  emptyText?: string;
  searchPlaceholder?: string;
  className?: string;
  isLoading?: boolean;
  multiple?: boolean;
};

export function TagSelector({
  tagGroups,
  selectedTags: externalSelectedTags,
  onSelectionChange,
  defaultSelectedTags = [],
  placeholder = 'Select tags...',
  emptyText = 'No tags found',
  searchPlaceholder = 'Search tags...',
  className = '',
  isLoading = false,
  multiple = true,
}: TagSelectorProps) {
  // Internal state for uncontrolled mode
  const [internalSelectedTags, setInternalSelectedTags] =
    useState<string[]>(defaultSelectedTags);

  // Determine if we're in controlled or uncontrolled mode
  const isControlled = externalSelectedTags !== undefined;
  const selectedTags = isControlled
    ? externalSelectedTags
    : internalSelectedTags;

  const [open, setOpen] = useState(false);

  // Memoize the allTags calculation to prevent recalculating on every render
  const allTags = useMemo(() => {
    return tagGroups.flatMap((group) => group.tags || []);
  }, [tagGroups]);

  // Handle tag selection
  const handleSelect = (id: string) => {
    let newSelectedTags: string[];

    if (multiple) {
      // For multi-select mode
      if (selectedTags.includes(id)) {
        // If already selected, remove it
        newSelectedTags = selectedTags.filter((tagId) => tagId !== id);
      } else {
        // Add the new tag
        newSelectedTags = [...selectedTags, id];
      }
    } else {
      // For single-select mode
      newSelectedTags = [id];
      setOpen(false); // Close dropdown after selection in single-select mode
    }

    if (!isControlled) {
      setInternalSelectedTags(newSelectedTags);
    }

    onSelectionChange?.(newSelectedTags);
  };

  // Handle tag removal
  const handleRemove = (id: string) => {
    const newSelectedTags = selectedTags.filter((tagId) => tagId !== id);

    if (!isControlled) {
      setInternalSelectedTags(newSelectedTags);
    }

    onSelectionChange?.(newSelectedTags);
  };

  return (
    <Tags open={open} onOpenChange={setOpen} className={className}>
      <TagsTrigger>
        {selectedTags.length > 0 ? (
          selectedTags.map((tagId) => {
            const tagData = allTags.find((t) => t.id === tagId);
            return tagData ? (
              <TagsValue key={tagId} onRemove={() => handleRemove(tagId)}>
                {tagData.name}
              </TagsValue>
            ) : null;
          })
        ) : (
          <span className="text-muted-foreground px-2 py-px">
            {placeholder}
          </span>
        )}
      </TagsTrigger>
      <TagsContent>
        <TagsInput placeholder={searchPlaceholder} />
        <TagsList>
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2Icon className="size-4 animate-spin" />
              <span className="ml-2 text-sm">Loading tags...</span>
            </div>
          ) : (
            <>
              <TagsEmpty>{emptyText}</TagsEmpty>
              {tagGroups.map((group) =>
                group.tags && group.tags.length > 0 ? (
                  <TagsGroup key={group.group_id} heading={group.group_name}>
                    {group.tags.map((tag) => (
                      <TagsItem
                        key={tag.id}
                        value={tag.name}
                        onSelect={() => handleSelect(tag.id)}
                      >
                        {tag.name}
                        {selectedTags.includes(tag.id) && (
                          <CheckIcon className="size-4" />
                        )}
                      </TagsItem>
                    ))}
                  </TagsGroup>
                ) : null
              )}
            </>
          )}
        </TagsList>
      </TagsContent>
    </Tags>
  );
}
