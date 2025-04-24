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

export default function TradeStatusFormField({ form, ...props }: Props) {
  return (
    <FormField
      control={form.control}
      name="status"
      render={({ field }) => (
        <FormItem className="col-span-6" {...props}>
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
            >
              <ToggleGroupItem value="FILLED" aria-label="Toggle Filled">
                Filled
              </ToggleGroupItem>
              <ToggleGroupItem value="PENDING" aria-label="Toggle Pending">
                Pending
              </ToggleGroupItem>
            </ToggleGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
