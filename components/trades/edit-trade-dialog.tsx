import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import EditTradeFrom, {
  EditTradeFromProps,
} from '@/components/trades/edit-trade-form';

export default function EditTradeDialog({
  title,
  formProps,
  ...props
}: {
  title?: string;
  formProps?: EditTradeFromProps;
} & React.ComponentProps<typeof Dialog>) {
  return (
    <Dialog {...props}>
      <DialogContent className="flex max-h-[80dvh] flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <EditTradeFrom {...formProps} />
      </DialogContent>
    </Dialog>
  );
}
