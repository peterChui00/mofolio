import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import AddTradeFrom from '@/components/trades/add-trade-form';

export default function AddTradeDialog({ ...props }) {
  return (
    <Dialog {...props}>
      <DialogContent className="flex max-h-[80dvh] flex-col">
        <DialogHeader>
          <DialogTitle>Add Trade</DialogTitle>
        </DialogHeader>
        <AddTradeFrom />
      </DialogContent>
    </Dialog>
  );
}
