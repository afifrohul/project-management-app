import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';

export default function EditButton({
  routeName,
  id,
  label = 'Edit',
  ...props
}) {
  const handleEdit = () => {
    router.get(route(routeName, id));
  };

  return (
    <Button size="sm" variant="outline" onClick={handleEdit} {...props}>
      {label}
    </Button>
  );
}
