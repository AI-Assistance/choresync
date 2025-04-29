import { useState } from "react";
import { useLocation } from "wouter";
import { Bell, Menu, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNotifications } from "@/hooks/use-notifications";
import { Badge } from "@/components/ui/badge";

interface TopBarProps {
  title: string;
  onToggleSidebar?: () => void;
  onAddChore: () => void;
  onToggleNotifications: () => void;
  searchEnabled?: boolean;
  onSearch?: (query: string) => void;
}

export default function TopBar({
  title,
  onToggleSidebar,
  onAddChore,
  onToggleNotifications,
  searchEnabled = true,
  onSearch
}: TopBarProps) {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { unreadCount } = useNotifications();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 md:py-3 md:px-6">
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 md:hidden">
        <h1 className="text-xl font-bold text-primary flex items-center">
          <svg
            className="w-5 h-5 mr-2"
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
        <button className="text-gray-500 focus:outline-none" onClick={onToggleSidebar}>
          <Menu className="w-6 h-6" />
        </button>
      </div>
      
      {/* Desktop Header Tools */}
      <div className="hidden md:flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
        <div className="flex items-center space-x-4">
          {searchEnabled && (
            <div className="relative">
              <Input
                type="text"
                placeholder="Search chores..."
                className="pl-10"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full text-gray-600 hover:text-primary hover:bg-gray-100"
            onClick={onToggleNotifications}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-destructive"
                variant="destructive"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
          
          <Button className="flex items-center" onClick={onAddChore}>
            <Plus className="mr-2 h-4 w-4" /> New Chore
          </Button>
        </div>
      </div>
    </header>
  );
}
