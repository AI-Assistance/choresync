import { Link, useLocation } from "wouter";
import { 
  BarChart3, 
  CalendarDays, 
  CheckSquare, 
  Plus, 
  User 
} from "lucide-react";

interface MobileNavigationProps {
  onAddChore: () => void;
}

export default function MobileNavigation({ onAddChore }: MobileNavigationProps) {
  const [location] = useLocation();

  return (
    <div className="md:hidden bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-10">
      <div className="flex justify-around">
        <Link href="/">
          <a className={`py-3 px-4 flex flex-col items-center ${location === '/' ? 'text-primary' : 'text-gray-500'}`}>
            <BarChart3 className="text-lg w-5 h-5" />
            <span className="text-xs mt-1">Dashboard</span>
          </a>
        </Link>
        <Link href="/my-chores">
          <a className={`py-3 px-4 flex flex-col items-center ${location === '/my-chores' ? 'text-primary' : 'text-gray-500'}`}>
            <CheckSquare className="text-lg w-5 h-5" />
            <span className="text-xs mt-1">My Chores</span>
          </a>
        </Link>
        <a 
          onClick={(e) => {
            e.preventDefault();
            onAddChore();
          }}
          className="py-1 px-4 flex flex-col items-center"
        >
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white">
            <Plus className="w-5 h-5" />
          </div>
        </a>
        <Link href="/calendar">
          <a className={`py-3 px-4 flex flex-col items-center ${location === '/calendar' ? 'text-primary' : 'text-gray-500'}`}>
            <CalendarDays className="text-lg w-5 h-5" />
            <span className="text-xs mt-1">Calendar</span>
          </a>
        </Link>
        <Link href="/settings">
          <a className={`py-3 px-4 flex flex-col items-center ${location === '/settings' ? 'text-primary' : 'text-gray-500'}`}>
            <User className="text-lg w-5 h-5" />
            <span className="text-xs mt-1">Profile</span>
          </a>
        </Link>
      </div>
    </div>
  );
}
