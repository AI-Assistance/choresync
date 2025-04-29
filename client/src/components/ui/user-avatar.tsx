import { User } from "@shared/schema";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserAvatarProps {
  user: User | {
    fullName: string;
    avatarColor?: string;
  };
  className?: string;
}

export default function UserAvatar({ user, className = "" }: UserAvatarProps) {
  const initials = user.fullName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();
  
  const style = user.avatarColor 
    ? { backgroundColor: user.avatarColor } 
    : { backgroundColor: "#4F46E5" };  // Default color
  
  return (
    <Avatar className={className} style={style}>
      <AvatarFallback className="text-white">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
