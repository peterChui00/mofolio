import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';

type PositionSideFormFieldProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: FieldPath<T>;
  label?: React.ReactNode;
  badgeProps?: React.ComponentPropsWithoutRef<typeof Badge>;
} & React.ComponentPropsWithoutRef<typeof FormItem>;

export default function PositionSideFormField<T extends FieldValues>({
  form,
  name,
  label,
  badgeProps,
  ...props
}: PositionSideFormFieldProps<T>) {
  const { className: badgeClassName, ...restBadgeProps } = badgeProps || {};

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        if (!field.value) return <></>;

        return (
          <FormItem {...props}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <Badge
                className={cn('h-9 w-full text-base', badgeClassName)}
                {...restBadgeProps}
              >
                {field.value}
              </Badge>
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
}
