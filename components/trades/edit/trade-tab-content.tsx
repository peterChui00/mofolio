'use client';

import { useEffect, useRef } from 'react';

import { useIsMobile } from '@/hooks/use-mobile';
import { useTradeForm } from '@/hooks/use-trade-form';
import { Skeleton } from '@/components/ui/skeleton';
import FormOrderCard from '@/components/trades/edit/form-order-card';
import FormOrderTable from '@/components/trades/edit/form-order-table';
import InputFormField from '@/components/trades/edit/input-form-field';
import PositionSideFormField from '@/components/trades/edit/position-side-form-field';

type FormOrderLayoutProps = {
  tradeForm: ReturnType<typeof useTradeForm>;
  isPrefilling?: boolean;
};

export default function TradeTabContent({
  tradeForm,
  isPrefilling,
}: FormOrderLayoutProps) {
  const isMobile = useIsMobile();
  const { form, fieldArray } = tradeForm;
  const { fields, append, remove } = fieldArray;
  // Field with default order values
  const defaultField = useRef(fields[0]);

  useEffect(() => {
    // Set the first field as default field
    defaultField.current = fields[0];
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const appendOrderField = async () => {
    const isValid = await form.trigger('symbol');
    if (!isValid) return;

    const { action: lastAction, status } =
      form.getValues('orders')[fields.length - 1];
    const { executedAt, price, quantity, fee } = defaultField.current;

    append({
      executedAt,
      action:
        lastAction === 'BUY'
          ? 'SELL'
          : lastAction === 'SELL'
            ? 'BUY'
            : lastAction,
      status,
      price,
      quantity,
      fee,
    });
  };

  const formOrderLayoutProps = {
    form,
    fields,
    onAppend: appendOrderField,
    onRemove: remove,
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-2">
        <InputFormField
          form={form}
          name="symbol"
          label="Symbol"
          className="col-span-6 md:col-span-10"
          inputProps={{ className: 'uppercase' }}
        />
        <PositionSideFormField
          form={form}
          name="side"
          label="Side"
          className="col-span-6 md:col-span-2"
        />
      </div>

      {isPrefilling ? (
        <div className="flex flex-col gap-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-md" />
          ))}
        </div>
      ) : isMobile ? (
        <FormOrderCard {...formOrderLayoutProps} />
      ) : (
        <FormOrderTable {...formOrderLayoutProps} />
      )}
    </>
  );
}
