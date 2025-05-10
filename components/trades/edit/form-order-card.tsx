import { PlusIcon, Trash2Icon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import DateFormField from '@/components/trades/edit/date-form-field';
import { FormOrderLayoutProps } from '@/components/trades/edit/edit-trade-form';
import InputFormField from '@/components/trades/edit/input-form-field';

const gridCols = 'grid grid-cols-4 gap-2';
const colSpans = {
  action: 'col-span-2',
  price: 'col-span-2',
  quantity: 'col-span-2',
  fee: 'col-span-2',
  executedAt: 'col-span-4',
  status: 'col-span-2',
  delete: 'col-span-1',
};

type FormOrderCardProps = FormOrderLayoutProps;

export default function FormOrderCard({
  form,
  fields,
  onAppend,
  onRemove,
}: FormOrderCardProps) {
  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border-border bg-muted/20 relative space-y-4 rounded-md border p-4"
        >
          <div className={gridCols}>
            <DateFormField
              form={form}
              name={`orders.${index}.executedAt`}
              label="Executed At"
              className={colSpans.executedAt}
            />
            <InputFormField
              form={form}
              name={`orders.${index}.action`}
              label="Action"
              className={colSpans.action}
            />
            <InputFormField
              form={form}
              name={`orders.${index}.status`}
              label="Status"
              className={colSpans.status}
            />
            <InputFormField
              form={form}
              name={`orders.${index}.price`}
              inputProps={{ type: 'number' }}
              label="Price"
              className={colSpans.price}
            />
            <InputFormField
              form={form}
              name={`orders.${index}.quantity`}
              inputProps={{ type: 'number' }}
              label="Quantity"
              className={colSpans.quantity}
            />
            <InputFormField
              form={form}
              name={`orders.${index}.fee`}
              inputProps={{ type: 'number' }}
              label="Fee"
              className={colSpans.fee}
            />
          </div>

          {fields.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-destructive absolute top-2 right-2"
              onClick={() => onRemove(index)}
            >
              <Trash2Icon size={16} />
            </Button>
          )}
        </div>
      ))}

      <Button type="button" variant="outline" onClick={onAppend}>
        <PlusIcon />
        Add Order
      </Button>
    </div>
  );
}
