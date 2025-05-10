import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

type InputFormFieldProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: FieldPath<T>;
  label?: React.ReactNode;
  inputProps?: React.ComponentPropsWithoutRef<typeof Input>;
} & React.ComponentPropsWithoutRef<typeof FormItem>;

export default function InputFormField<T extends FieldValues>({
  form,
  name,
  label,
  inputProps,
  ...props
}: InputFormFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem {...props}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input {...field} {...inputProps} value={field.value ?? ''} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
