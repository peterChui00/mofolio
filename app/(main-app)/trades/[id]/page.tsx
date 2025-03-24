import TradeDetail from '@/components/trades/trade-detail';

export default async function TradeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return (
    <div className="flex h-full flex-1 flex-col p-4">
      <TradeDetail id={id} />
    </div>
  );
}
