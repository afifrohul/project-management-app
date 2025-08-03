import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function AssignmentSelect({
  users = [],
  selected = [],
  onChange,
}) {
  const [open, setOpen] = useState(false);

  const toggleUser = (userId) => {
    if (selected.includes(userId)) {
      onChange(selected.filter((id) => id !== userId));
    } else {
      onChange([...selected, userId]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {selected.length > 0
            ? `${selected.length} user(s) selected`
            : 'Assign users'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 max-h-64 overflow-y-auto p-2">
        <div className="flex flex-col gap-2">
          {users.map((user) => (
            <div key={user.id} className="flex items-center gap-2">
              <Checkbox
                id={`user-${user.id}`}
                checked={selected.includes(user.id)}
                onCheckedChange={() => toggleUser(user.id)}
              />
              <Label htmlFor={`user-${user.id}`} className="cursor-pointer">
                {user.name}
              </Label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
