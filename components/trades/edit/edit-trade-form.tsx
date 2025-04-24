import { UseFormReturn } from 'react-hook-form';

import { EditTradeFormValues } from '@/hooks/use-edit-trade-form';
import { Form } from '@/components/ui/form';
import DateFormField from '@/components/trades/edit/date-form-field';
import NumberFormField from '@/components/trades/edit/number-form-field';
import TextFormField from '@/components/trades/edit/text-form-field';
import TradeActionFormField from '@/components/trades/edit/trade-action-form-field';
import TradeStatusFormField from '@/components/trades/edit/trade-status-form-field';

type EditTradeFromProps = {
  form: UseFormReturn<EditTradeFormValues>;
  className?: string;
} & React.ComponentPropsWithoutRef<'form'>;

export default function EditTradeForm({
  form,
  className,
  onSubmit,
  ...props
}: EditTradeFromProps) {
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className={className} {...props}>
        <TradeStatusFormField form={form} className="col-span-12" />
        <TradeActionFormField form={form} className="col-span-6" />
        <DateFormField form={form} className="col-span-6" />
        <TextFormField
          form={form}
          name="symbol"
          label="Symbol"
          className="col-span-6"
        />
        <NumberFormField
          form={form}
          name="quantity"
          label="Quantity"
          className="col-span-6"
        />
        <NumberFormField
          form={form}
          name="price"
          label="Price"
          className="col-span-6"
        />
        <NumberFormField
          form={form}
          name="fee"
          label="Fee"
          className="col-span-6"
        />
      </form>
    </Form>
  );
}
