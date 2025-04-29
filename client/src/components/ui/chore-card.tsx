import { useState } from "react";
import { MoreVertical, Trash, Edit, Repeat } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow, isPast, isToday, isTomorrow, format } from "date-fns";
import { Chore } from "@shared/schema";
import { Button } from "./button";

interface ChoreCardProps {
  chore: Chore;
  onComplete?: (chore: Chore) => void;
  onEdit?: (chore: Chore) => void;
  onDelete?: (chore: Chore) => void;
  showAssignee?: boolean;
  assigneeName?: string;
  isOverdue?: boolean;
  variant?: "today" | "upcoming";
}

export function ChoreCard({
  chore,
  onComplete,
  onEdit,
  onDelete,
  showAssignee = false,
  assigneeName,
  isOverdue = false,
  variant = "today"
}: ChoreCardProps) {
  const [checked, setChecked] = useState(chore.completed);

  const handleCheckboxChange = (isChecked: boolean) => {
    if (onComplete && isChecked !== checked) {
      setChecked(isChecked);
      onComplete(chore);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(chore);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(chore);
    }
  };

  const formatDueDate = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isPast(date)) return `${formatDistanceToNow(date)} ago`;
    return format(date, "EEE, MMM d");
  };

  if (variant === "today") {
    return (
      <div className={`chore-card bg-white border ${isOverdue ? 'border-destructive' : 'border-gray-200'} rounded-lg p-4 flex items-center justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-md`}>
        <div className="flex items-center">
          <Checkbox
            id={`chore-${chore.id}`}
            checked={checked}
            onCheckedChange={handleCheckboxChange}
            className="h-5 w-5"
          />
          <label
            htmlFor={`chore-${chore.id}`}
            className={`ml-3 font-medium ${checked ? 'line-through text-gray-400' : isOverdue ? 'text-destructive' : ''}`}
          >
            {chore.name}
          </label>
        </div>
        <div className="flex items-center">
          <Badge 
            variant={isOverdue ? "destructive" : "outline"} 
            className={isOverdue ? "bg-destructive/10 text-destructive" : `bg-${chore.category.toLowerCase().replace(' ', '-')}/10`}
          >
            {isOverdue ? "Overdue" : chore.category}
          </Badge>
          <span className="text-sm text-gray-500 ml-3">{chore.estimatedMinutes} min</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-1 h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  } else {
    // Upcoming variant
    return (
      <div className="chore-card bg-white border border-gray-200 rounded-lg p-4 flex justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
        <div className="flex flex-col">
          <h3 className="font-medium">{chore.name}</h3>
          {showAssignee && (
            <span className="text-sm text-gray-500">
              Assigned to {assigneeName || "Unknown"}
            </span>
          )}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium">
            {formatDueDate(new Date(chore.dueDate))}
          </span>
          <div className="flex items-center text-xs text-gray-500">
            <span>{chore.estimatedMinutes} min</span>
            {chore.repeatFrequency !== "Never" && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Repeat className="ml-1 h-3 w-3" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Repeats {chore.repeatFrequency.toLowerCase()}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </div>
    );
  }
}
