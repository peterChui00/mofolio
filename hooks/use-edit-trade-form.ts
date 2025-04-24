import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const editTradeFormSchema = z.object({
  action: z.enum(['BUY', 'SELL']),
  executedAt: z.date({
    message: 'Date is required',
  }),
  symbol: z.string().nonempty({ message: 'Symbol must not be empty' }),
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

export type EditTradeFormValues = z.infer<typeof editTradeFormSchema>;

export function useEditTradeForm(defaultValues?: EditTradeFormValues) {
  const form = useForm<EditTradeFormValues>({
    resolver: zodResolver(editTradeFormSchema),
    defaultValues: {
      action: 'BUY',
      symbol: '',
      status: 'FILLED',
      ...defaultValues,
    },
  });
  return form;
}
