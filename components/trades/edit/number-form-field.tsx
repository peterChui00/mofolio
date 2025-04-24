import React from 'react';
import { UseFormReturn } from 'react-hook-form';

import { EditTradeFormValues } from '@/hooks/use-edit-trade-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

type NumberKeys<T> = {
  [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

type Props = {
  form: UseFormReturn<EditTradeFormValues>;
  name: NumberKeys<EditTradeFormValues>;
  label: React.ReactNode;
  inputProps?: React.ComponentPropsWithoutRef<typeof Input>;
} & React.ComponentPropsWithoutRef<typeof FormItem>;

export default function NumberFormField({
  form,
  name,
  label,
  inputProps,
  ...props
}: Props) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="col-span-6" {...props}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              type="number"
              min={0}
              value={field.value ?? ''}
              {...inputProps}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
