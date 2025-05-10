import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type SelectOption = {
  label: string;
  value: string;
};

type SelectFormFieldProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: FieldPath<T>;
  label?: React.ReactNode;
  options: SelectOption[];
  selectTriggerProps?: React.ComponentPropsWithoutRef<typeof SelectTrigger>;
} & React.ComponentPropsWithoutRef<typeof FormItem>;

export default function SelectFormField<T extends FieldValues>({
  form,
  name,
  label,
  options,
  selectTriggerProps,
  ...props
}: SelectFormFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem {...props}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
            >
              <SelectTrigger className="w-full" {...selectTriggerProps}>
                <SelectValue placeholder="Select an option..." />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
