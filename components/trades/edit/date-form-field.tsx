import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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

type DateFormFieldProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: FieldPath<T>;
  label?: React.ReactNode;
} & React.ComponentPropsWithoutRef<typeof FormItem>;

export default function DateFormField<T extends FieldValues>({
  form,
  name,
  label,
  className,
  ...props
}: DateFormFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className} {...props}>
          {label && <FormLabel>{label}</FormLabel>}
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    'pl-3 text-left font-normal',
                    !field.value && 'text-muted-foreground'
                  )}
                >
                  {field.value ? (
                    format(field.value, 'PPP')
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
