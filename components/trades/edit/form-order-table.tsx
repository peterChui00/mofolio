import { PlusIcon, Trash2Icon } from 'lucide-react';
import { FieldArrayWithId, UseFormReturn } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { TradeFormValues } from '@/hooks/use-trade-form';
import { Button } from '@/components/ui/button';
import DateFormField from '@/components/trades/edit/date-form-field';
import InputFormField from '@/components/trades/edit/input-form-field';
import SelectFormField from '@/components/trades/edit/select-form-field';
import ToggleGroupFormField from '@/components/trades/edit/toggle-group-form-field';

const gridCols = 'grid grid-cols-15 gap-2';
const colSpans = {
  status: 'col-span-2',
  executedAt: 'col-span-4',
  action: 'col-span-2',
  price: 'col-span-2',
  quantity: 'col-span-2',
  fee: 'col-span-2',
  delete: 'col-span-1',
};

type FormOrderTableProps = {
  form: UseFormReturn<TradeFormValues>;
  fields: FieldArrayWithId<TradeFormValues, 'orders', 'id'>[];
  onAppend: () => void;
  onRemove: (index: number) => void;
};

export default function FormOrderTable({
  form,
  fields,
  onAppend,
  onRemove,
}: FormOrderTableProps) {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className={cn(gridCols, 'border-b pb-2 text-sm font-semibold')}>
        <div className={colSpans.status}>Status</div>
        <div className={colSpans.action}>Action</div>
        <div className={colSpans.executedAt}>Date</div>
        <div className={colSpans.price}>Price</div>
        <div className={colSpans.quantity}>Qty</div>
        <div className={colSpans.fee}>Fee</div>
      </div>

      {/* Rows */}
      {fields.map((field, index) => (
        <div key={field.id} className={cn(gridCols, 'py-2')}>
          <SelectFormField
            form={form}
            name={`orders.${index}.status`}
            className={colSpans.status}
            options={[
              { label: 'Filled', value: 'FILLED' },
              { label: 'Pending', value: 'PENDING' },
            ]}
          />
          <ToggleGroupFormField
            form={form}
            name={`orders.${index}.action`}
            className={colSpans.action}
            options={[
              {
                value: 'BUY',
                label: 'Buy',
                ariaLabel: 'Toggle buy',
                className:
                  'data-[state=on]:bg-green-600 data-[state=on]:text-white',
              },
              {
                value: 'SELL',
                label: 'Sell',
                ariaLabel: 'Toggle sell',
                className:
                  'data-[state=on]:bg-red-600 data-[state=on]:text-white',
              },
            ]}
          />
          <DateFormField
            form={form}
            name={`orders.${index}.executedAt`}
            className={colSpans.executedAt}
          />
          <InputFormField
            form={form}
            name={`orders.${index}.price`}
            inputProps={{ type: 'number' }}
            className={colSpans.price}
          />
          <InputFormField
            form={form}
            name={`orders.${index}.quantity`}
            inputProps={{ type: 'number' }}
            className={colSpans.quantity}
          />
          <InputFormField
            form={form}
            name={`orders.${index}.fee`}
            inputProps={{ type: 'number' }}
            className={colSpans.fee}
          />
          <div className={cn(colSpans.delete, 'flex justify-center')}>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive"
              disabled={fields.length === 1}
              onClick={() => onRemove(index)}
            >
              <Trash2Icon />
            </Button>
          </div>
        </div>
      ))}

      {/* Add Order Button */}
      <div className="mb-1 flex justify-center">
        <Button type="button" variant="outline" onClick={onAppend}>
          <PlusIcon />
          Add Order
        </Button>
      </div>
    </div>
  );
}
