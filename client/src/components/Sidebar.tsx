import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useHousehold } from "@/hooks/use-household";
import UserAvatar from "@/components/ui/user-avatar";
import { 
  BarChart3, 
  CalendarDays, 
  CheckSquare, 
  Home, 
  Settings, 
  PieChart
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className = "" }: SidebarProps) {
  const [location] = useLocation();
  const { user } = useAuth();
  const { currentHousehold } = useHousehold();

  if (!user) return null;

  return (
    <aside className={`hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen ${className}`}>
      <div className="p-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-primary flex items-center">
          <svg
            className="w-6 h-6 mr-2"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22 8.36842C22 9.57438 21.1046 10.5453 20 10.5453C18.8954 10.5453 18 9.57438 18 8.36842C18 7.16247 18.8954 6.19153 20 6.19153C21.1046 6.19153 22 7.16247 22 8.36842Z"
              fill="currentColor"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M14.873 9.36842H9.12704C7.25337 9.36842 5.73313 10.9839 5.73313 12.9785V19.0001H18.2668V12.9785C18.2668 10.9839 16.7466 9.36842 14.873 9.36842ZM12 12.9474C11.0572 12.9474 10.2934 13.7694 10.2934 14.7895C10.2934 15.8095 11.0572 16.6316 12 16.6316C12.9428 16.6316 13.7066 15.8095 13.7066 14.7895C13.7066 13.7694 12.9428 12.9474 12 12.9474Z"
              fill="currentColor"
            />
            <path
              d="M12 8.36842C13.1046 8.36842 14 7.39748 14 6.19153C14 4.98557 13.1046 4.01463 12 4.01463C10.8954 4.01463 10 4.98557 10 6.19153C10 7.39748 10.8954 8.36842 12 8.36842Z"
              fill="currentColor"
            />
            <path
              d="M6 10.5453C7.10457 10.5453 8 9.57438 8 8.36842C8 7.16247 7.10457 6.19153 6 6.19153C4.89543 6.19153 4 7.16247 4 8.36842C4 9.57438 4.89543 10.5453 6 10.5453Z"
              fill="currentColor"
            />
            <path
              d="M5.73313 19.0001H18.2668V20.0001H5.73313V19.0001Z"
              fill="currentColor"
            />
          </svg>
          ChoreSync
        </h1>
      </div>
      
      {currentHousehold && (
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
              <span>{currentHousehold.name.charAt(0)}</span>
            </div>
            <div className="ml-3">
              <h2 className="font-semibold">{currentHousehold.name}</h2>
              <p className="text-sm text-gray-500">{currentHousehold.members.length} member{currentHousehold.members.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>
      )}
      
      <nav className="p-2 flex-grow overflow-y-auto">
        <ul>
          <li className="mb-1">
            <Link href="/">
              <a className={`flex items-center p-3 rounded-lg ${location === '/' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                <BarChart3 className="w-5 h-5" />
                <span className="ml-3">Dashboard</span>
              </a>
            </Link>
          </li>
          <li className="mb-1">
            <Link href="/my-chores">
              <a className={`flex items-center p-3 rounded-lg ${location === '/my-chores' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                <CheckSquare className="w-5 h-5" />
                <span className="ml-3">My Chores</span>
              </a>
            </Link>
          </li>
          <li className="mb-1">
            <Link href="/calendar">
              <a className={`flex items-center p-3 rounded-lg ${location === '/calendar' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                <CalendarDays className="w-5 h-5" />
                <span className="ml-3">Calendar</span>
              </a>
            </Link>
          </li>
          <li className="mb-1">
            <Link href="/household">
              <a className={`flex items-center p-3 rounded-lg ${location === '/household' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                <Home className="w-5 h-5" />
                <span className="ml-3">Household</span>
              </a>
            </Link>
          </li>
          <li className="mb-1">
            <Link href="/statistics">
              <a className={`flex items-center p-3 rounded-lg ${location === '/statistics' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                <PieChart className="w-5 h-5" />
                <span className="ml-3">Statistics</span>
              </a>
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <UserAvatar 
            user={user}
            className="w-10 h-10"
          />
          <div className="ml-3">
            <p className="font-medium text-sm">{user.fullName}</p>
            <Link href="/settings">
              <a className="text-xs text-primary hover:underline">Settings</a>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
