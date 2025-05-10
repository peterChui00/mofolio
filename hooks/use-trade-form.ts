'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

export const orderFormSchema = z.object({
  action: z.enum(['BUY', 'SELL']),
  executedAt: z.date({
    message: 'Date is required',
  }),
  price: z.coerce
    .number({
      message: 'Price is required',
    })
    .nonnegative({
      message: 'Price must be a non-negative number',
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
  status: z.enum(['FILLED', 'PENDING']),
});

export const tradeFormSchema = z.object({
  symbol: z.string().nonempty({ message: 'Symbol must not be empty' }),
  side: z.enum(['LONG', 'SHORT']).nullable(),
  notes: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
  orders: z.array(orderFormSchema).min(1, {
    message: 'At least one order is required',
  }),
});

export type TradeFormValues = z.infer<typeof tradeFormSchema>;

const calculatePositionSide = (orders: TradeFormValues['orders']) => {
  if (orders.length === 0) return null;

  let previousNetQty = 0;
  let netQty = 0;

  for (const { action, quantity } of orders) {
    previousNetQty = netQty;
    netQty = previousNetQty + Number(action === 'BUY' ? quantity : -quantity);
  }

  const qty = netQty === 0 ? previousNetQty : netQty;
  return isNaN(qty) || qty === 0 ? null : qty > 0 ? 'LONG' : 'SHORT';
};

export function useTradeForm(defaultValues?: TradeFormValues) {
  const form = useForm<TradeFormValues>({
    resolver: zodResolver(tradeFormSchema),
    defaultValues: {
      symbol: '',
      notes: '',
      orders: [
        {
          action: 'BUY',
          status: 'FILLED',
        },
      ],
      ...defaultValues,
    },
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: 'orders',
  });

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name?.startsWith('orders') && value.orders) {
        const newSide = calculatePositionSide(form.getValues('orders'));
        form.setValue('side', newSide);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  return {
    form,
    fieldArray,
  };
}
