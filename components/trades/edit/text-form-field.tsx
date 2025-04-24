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

type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

type Props = {
  form: UseFormReturn<EditTradeFormValues>;
  name: StringKeys<EditTradeFormValues>;
  label: React.ReactNode;
} & React.ComponentPropsWithoutRef<typeof FormItem>;

export default function TextFormField({ form, name, label, ...props }: Props) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem {...props}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
