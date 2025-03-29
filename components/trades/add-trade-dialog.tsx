import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import AddTradeFrom, {
  AddTradeFromProps,
} from '@/components/trades/add-trade-form';

export default function AddTradeDialog({
  title,
  formProps,
  ...props
}: {
  title?: string;
  formProps?: AddTradeFromProps;
} & React.ComponentProps<typeof Dialog>) {
  return (
    <Dialog {...props}>
      <DialogContent className="flex max-h-[80dvh] flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <AddTradeFrom {...formProps} />
      </DialogContent>
    </Dialog>
  );
}
