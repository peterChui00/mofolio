import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

type ToggleOption = {
  label: React.ReactNode;
  value: string;
  ariaLabel?: string;
  className?: string;
} & React.ComponentPropsWithoutRef<typeof ToggleGroupItem>;

type ToggleGroupFormFieldProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: FieldPath<T>;
  label?: React.ReactNode;
  options: ToggleOption[];
  type?: 'single' | 'multiple';
  toggleGroupProps?: React.ComponentPropsWithRef<typeof ToggleGroup>;
  toggleItemProps?: React.ComponentPropsWithoutRef<typeof ToggleGroupItem>;
} & React.ComponentPropsWithoutRef<typeof FormItem>;

export default function ToggleGroupFormField<T extends FieldValues>({
  form,
  name,
  label,
  options,
  toggleGroupProps,
  toggleItemProps,
  ...formItemProps
}: ToggleGroupFormFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem {...formItemProps}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl className="items-start">
            <ToggleGroup
              className="w-full"
              type="single"
              variant="outline"
              value={field.value}
              onValueChange={(value: string | string[]) => {
                if (value) field.onChange(value);
              }}
              {...toggleGroupProps}
            >
              {options.map(({ label, value, ariaLabel, ...itemProps }) => (
                <ToggleGroupItem
                  key={value}
                  value={value}
                  aria-label={ariaLabel || `Toggle ${label}`}
                  {...toggleItemProps}
                  {...itemProps}
                >
                  {label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
