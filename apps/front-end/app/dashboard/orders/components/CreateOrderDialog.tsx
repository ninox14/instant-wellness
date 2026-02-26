import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { OrderForm } from './OrderForm';

export function CreateOrderDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Create order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create order</DialogTitle>
        </DialogHeader>
        <OrderForm />
      </DialogContent>
    </Dialog>
  );
}
