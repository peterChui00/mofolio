import { useCallback, useEffect, useRef, useState } from 'react';
import { DefaultValues, UseFormReturn } from 'react-hook-form';

import { useOrders } from '@/hooks/use-orders';
import { useSupabase } from '@/hooks/use-supabase';
import { useTags } from '@/hooks/use-tags';
import {
  initialDefaultTradeFormValues,
  TradeFormValues,
} from '@/hooks/use-trade-form';
import { useUser } from '@/hooks/use-user';

export function usePrefillTradeForm({
  enable,
  form,
  trade,
}: {
  enable: boolean;
  form: UseFormReturn<TradeFormValues>;
  trade: { id?: string; symbol?: string; notes?: string; tags: string[] };
}) {
  const supabase = useSupabase();
  const user = useUser();
  const userId = user?.id || '';
  const [initialValues, setInitialValues] =
    useState<DefaultValues<TradeFormValues> | null>(null);
  const hasPrefilledForm = useRef(false);

  const { data: tagGroupsWithTags = [], isSuccess: areTagsLoaded } = useTags({
    client: supabase,
    userId,
  });
  const { data: tradeOrders, isSuccess: areOrdersLoaded } = useOrders({
    client: supabase,
    tradeId: trade.id,
  });

  // Reset when switching mode
  useEffect(() => {
    hasPrefilledForm.current = false;

    if (!enable) {
      form.reset(initialDefaultTradeFormValues);
      setInitialValues(null);
    }
  }, [enable, form, trade.id]);

  // Fill symbol and notes
  useEffect(() => {
    if (enable && !hasPrefilledForm.current) {
      form.reset({
        ...initialDefaultTradeFormValues,
        symbol: trade.symbol ?? '',
        notes: trade.notes ?? '',
      });
    }
  }, [enable, form, trade.symbol, trade.notes]);

  // Fill tagIds and orders
  useEffect(() => {
    if (
      !enable ||
      !areTagsLoaded ||
      !areOrdersLoaded ||
      hasPrefilledForm.current
    ) {
      return;
    }

    const allTags = tagGroupsWithTags.flatMap(
      (g) => g.tags?.filter(Boolean) ?? []
    );
    const tagMap = new Map(allTags.map((tag) => [tag.name, tag.id]));
    const tagIds = trade.tags
      .map((tagName) => tagMap.get(tagName))
      .filter((id): id is string => Boolean(id));

    const formattedOrders = (tradeOrders || []).map((order) => ({
      status: order.status,
      action: order.action,
      executedAt: order.executed_at ? new Date(order.executed_at) : new Date(),
      price: order.price,
      quantity: order.quantity,
      fee: order.fee,
    }));

    const defaultValues = {
      ...form.getValues(),
      tagIds,
      orders: formattedOrders,
    };

    form.reset(defaultValues);
    setInitialValues(defaultValues);
    hasPrefilledForm.current = true;
  }, [
    enable,
    form,
    areTagsLoaded,
    areOrdersLoaded,
    tagGroupsWithTags,
    tradeOrders,
    trade.tags,
  ]);

  const resetToInitial = useCallback(() => {
    form.reset(initialValues ?? undefined);
  }, [form, initialValues]);

  const updateInitial = useCallback(
    (newValues: DefaultValues<TradeFormValues>) => {
      setInitialValues(newValues);
    },
    []
  );

  return {
    resetToInitial,
    updateInitial,
    isLoading: !areTagsLoaded || !areOrdersLoaded,
  };
}
