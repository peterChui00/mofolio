'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useForm, UseFormProps } from 'react-hook-form';
import { z } from 'zod';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { DialogFooter } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useStore } from '@/components/layout/app-store-provider';

const FormSchema = z.object({
  type: z.enum(['BUY', 'SELL']),
  timestamp: z.date({
    message: 'Date is required',
  }),
  symbol: z.string().nonempty({ message: 'Symbol must not be empty' }),
  price: z.coerce
    .number({
      message: 'Price is required',
    })
    .positive({
      message: 'Price must be a positive number',
    }),
  quantity: z.coerce
    .number({
      message: 'Quantity is required',
    })
    .positive({
      message: 'Quantity must be a positive number',
    }),
  fee: z.coerce
    .number({
      message: 'Fee is required',
    })
    .nonnegative({
      message: 'Fee must be a non-negative number',
    }),
  status: z.enum(['FILLED', 'PENDING', 'STOP_LOSS', 'TAKE_PROFIT']),
});

export type TradeForm = z.infer<typeof FormSchema>;

export type EditTradeFromProps = {
  defaultValues?: UseFormProps<TradeForm>['defaultValues'];
  fieldOptions?: Partial<
    Record<keyof TradeForm, { disabled?: boolean; visible?: boolean }>
  >;
  onSubmit?: (data: TradeForm) => void;
};

export default function EditTradeFrom({
  defaultValues,
  fieldOptions,
  onSubmit,
}: EditTradeFromProps) {
  const addOrder = useStore((state) => state.addOrder);
  const toggleEditTradeDialog = useStore(
    (state) => state.toggleEditTradeDialog
  );

  const form = useForm<TradeForm>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: 'BUY',
      symbol: '',
      status: 'FILLED',
      ...defaultValues,
    },
  });

  const isFieldVisible = (field: keyof TradeForm) =>
    fieldOptions?.[field]?.visible !== false;

  const isFieldDisabled = (field: keyof TradeForm) =>
    fieldOptions?.[field]?.disabled ?? false;

  const handleSubmit = (data: TradeForm) => {
    if (typeof onSubmit === 'function') {
      return onSubmit(data);
    }

    // Fallback to default behavior
    addOrder({
      ...data,
      timestamp: data.timestamp.toISOString(),
      id: nanoid(),
      note: '',
      tags: [],
    });
    toggleEditTradeDialog(false);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="-mx-6 grid grid-cols-12 gap-4 overflow-y-auto px-6"
        >
          {isFieldVisible('type') && (
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="col-span-6">
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      className="w-full"
                      type="single"
                      variant="outline"
                      onValueChange={(value) => {
                        if (value) field.onChange(value);
                      }}
                      value={field.value}
                      disabled={isFieldDisabled('type')}
                    >
                      <ToggleGroupItem value="BUY" aria-label="Toggle Buy">
                        Buy
                      </ToggleGroupItem>
                      <ToggleGroupItem value="SELL" aria-label="Toggle Sell">
                        Sell
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {isFieldVisible('timestamp') && (
            <FormField
              control={form.control}
              name="timestamp"
              render={({ field }) => (
                <FormItem className="col-span-6">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                          disabled={isFieldDisabled('timestamp')}
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
                        disabled={fieldOptions?.timestamp?.disabled}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {isFieldVisible('symbol') && (
            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem className="col-span-6">
                  <FormLabel>Symbol</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isFieldDisabled('symbol')} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {isFieldVisible('price') && (
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="col-span-6">
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={0}
                      value={field.value ?? ''}
                      disabled={isFieldDisabled('price')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {isFieldVisible('quantity') && (
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem className="col-span-6">
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={0}
                      value={field.value ?? ''}
                      disabled={isFieldDisabled('quantity')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {isFieldVisible('fee') && (
            <FormField
              control={form.control}
              name="fee"
              render={({ field }) => (
                <FormItem className="col-span-6">
                  <FormLabel>Fee</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={0}
                      value={field.value ?? ''}
                      disabled={isFieldDisabled('fee')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {isFieldVisible('status') && (
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="col-span-6">
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      className="w-full"
                      type="single"
                      variant="outline"
                      onValueChange={(value) => {
                        if (value) field.onChange(value);
                      }}
                      value={field.value}
                      disabled={isFieldDisabled('status')}
                    >
                      <ToggleGroupItem
                        value="FILLED"
                        aria-label="Toggle Filled"
                      >
                        Filled
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="PENDING"
                        aria-label="Toggle Pending"
                      >
                        Pending
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </form>
      </Form>
      <DialogFooter>
        <Button type="submit" onClick={form.handleSubmit(handleSubmit)}>
          Submit
        </Button>
      </DialogFooter>
    </>
  );
}
