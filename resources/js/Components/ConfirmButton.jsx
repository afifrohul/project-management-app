import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function ConfirmButton({
  routeName,
  id,
  confirmMessage = 'Are you sure to continue this action?',
  label = 'Delete',
  method = 'delete',
  variant = 'default',
  data = {},
  onSuccess,
  onError,
  ...props
}) {
  const handleAction = () => {
    const url = route(routeName, id);

    const options = {
      preserveScroll: true,
      onSuccess,
      onError,
    };

    switch (method.toLowerCase()) {
      case 'delete':
        router.delete(url, options);
        break;
      case 'put':
        router.put(url, data, options);
        break;
      case 'patch':
        router.patch(url, data, options);
        break;
      case 'post':
        router.post(url, data, options);
        break;
      default:
        console.warn(`Unsupported method: ${method}`);
        break;
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant={variant} {...props}>
          {label}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>{confirmMessage}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleAction}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
