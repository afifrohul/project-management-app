import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AvatarInitials({ name }) {
  function getInitials(name) {
    if (!name) return '';
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0][0]?.toUpperCase();
    }
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  return (
    <Avatar className="h-8 w-8 rounded-lg grayscale">
      {/* <AvatarImage src={name} alt={name} /> */}
      <AvatarFallback className="rounded-lg">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
