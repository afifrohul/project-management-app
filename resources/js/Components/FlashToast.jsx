import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';

export default function FlashToast() {
  const { flash } = usePage().props;

  useEffect(() => {
    if (flash?.success) toast.success(flash.success);
    if (flash?.error) toast.error(flash.error);
    if (flash?.info) toast(flash.info);
  }, [flash]);

  return null;
}
