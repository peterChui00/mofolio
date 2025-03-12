'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
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
});

export default function AddTradeFrom() {
  const addOrder = useStore((state) => state.addOrder);
  const toggleAddTradeDialog = useStore((state) => state.toggleAddTradeDialog);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: 'BUY',
      symbol: '',
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log('Submitted new trade: ', JSON.stringify(data, null, 2));
    addOrder({
      ...data,
      timestamp: data.timestamp.toISOString(),
      status: 'FILLED',
      id: crypto.randomUUID(),
      note: '',
      tags: [],
    });
    toggleAddTradeDialog(false);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="-mx-6 grid grid-cols-12 gap-4 overflow-y-auto px-6"
        >
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
                      value && field.onChange(value);
                    }}
                    value={field.value}
                  >
                    <ToggleGroupItem value="BUY" aria-label="Toggle BUY">
                      BUY
                    </ToggleGroupItem>
                    <ToggleGroupItem value="SELL" aria-label="Toggle SELL">
                      SELL
                    </ToggleGroupItem>
                  </ToggleGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="symbol"
            render={({ field }) => (
              <FormItem className="col-span-6">
                <FormLabel>Symbol</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <DialogFooter>
        <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
          Submit
        </Button>
      </DialogFooter>
    </>
  );
}
