import { UseFormReturn } from 'react-hook-form';

import { EditTradeFormValues } from '@/hooks/use-edit-trade-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

type Props = {
  form: UseFormReturn<EditTradeFormValues>;
} & React.ComponentPropsWithoutRef<typeof FormItem>;

export default function TradeActionFormField({ form, ...props }: Props) {
  return (
    <FormField
      control={form.control}
      name="action"
      render={({ field }) => (
        <FormItem {...props}>
          <FormLabel>Action</FormLabel>
          <FormControl>
            <ToggleGroup
              className="w-full"
              type="single"
              variant="outline"
              onValueChange={(value) => {
                if (value) field.onChange(value);
              }}
              value={field.value}
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
  );
}
