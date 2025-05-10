import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { TagSelector } from '@/components/tag-selector';

type TagsFormFieldProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: FieldPath<T>;
  label?: React.ReactNode;
  tagsProps?: React.ComponentPropsWithoutRef<typeof TagSelector>;
} & React.ComponentPropsWithoutRef<typeof FormItem>;

export default function TagsFormField<T extends FieldValues>({
  form,
  name,
  label,
  tagsProps,
  ...props
}: TagsFormFieldProps<T>) {
  const { tagGroups = [], ...otherTagsProps } = tagsProps || {};

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem {...props}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <TagSelector
              selectedTags={field.value}
              onSelectionChange={field.onChange}
              tagGroups={tagGroups}
              {...otherTagsProps}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
