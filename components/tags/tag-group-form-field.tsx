import { TagGroupWithTags } from '@/types';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { TagFormValues } from '@/components/tags/edit-tag-dialog';

export default function TagGroupFormField({
  form,
  data = [],
  disabled = false,
}: {
  form: UseFormReturn<TagFormValues>;
  data?: TagGroupWithTags[];
  disabled?: boolean;
}) {
  return (
    <FormField
      control={form.control}
      name="groupId"
      render={({ field }) => {
        const selectedGroup = data.find((g) => g.group_id === field.value);
        return (
          <FormItem>
            <FormLabel>Tag Group</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                    disabled={disabled}
                  >
                    {selectedGroup?.group_name ?? 'Ungrouped'}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search tag group..." />
                  <CommandList>
                    <CommandEmpty>No tag group found.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        key="ungrouped"
                        value=""
                        onSelect={() => {
                          form.setValue('groupId', null);
                        }}
                      >
                        <CheckIcon
                          className={cn(
                            'mr-2 h-4 w-4',
                            field.value == null ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        Ungrouped
                      </CommandItem>
                      {data?.map(
                        (group) =>
                          group.group_id !== 'ungrouped' && (
                            <CommandItem
                              key={group.group_id}
                              value={group.group_id}
                              onSelect={() => {
                                form.setValue('groupId', group.group_id);
                              }}
                            >
                              <CheckIcon
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  field.value === group.group_id
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              {group.group_name}
                            </CommandItem>
                          )
                      )}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
