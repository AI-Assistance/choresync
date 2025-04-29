import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChoreCard } from "@/components/ui/chore-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useHousehold } from "@/hooks/use-household";
import { useChores } from "@/hooks/use-chores";
import { isPast, isToday } from "date-fns";
import { Chore } from "@shared/schema";

interface TodaysChoresProps {
  onChoreComplete: (choreId: number) => Promise<void>;
}

export default function TodaysChores({ onChoreComplete }: TodaysChoresProps) {
  const { currentHousehold } = useHousehold();
  const { removeChore, updateChore } = useChores();
  
  const { data: todaysChores, isLoading } = useQuery({
    queryKey: ['/api/chores/today'],
  });
  
  const { data: overdueChores, isLoading: loadingOverdue } = useQuery({
    queryKey: ['/api/chores/overdue'],
  });

  const handleChoreComplete = async (chore: Chore) => {
    await onChoreComplete(chore.id);
  };

  const handleEdit = (chore: Chore) => {
    // Editing would be implemented with a modal similar to AddChoreModal
    // For now we'll just log
    console.log("Edit chore:", chore);
  };

  const handleDelete = async (chore: Chore) => {
    try {
      await removeChore(chore.id);
    } catch (error) {
      console.error("Failed to delete chore:", error);
    }
  };

  // Combine today's chores with overdue chores
  const allChores = [...(todaysChores || []), ...(overdueChores || [])];
  
  // Sort: overdue first, then incomplete, then completed
  const sortedChores = allChores.sort((a, b) => {
    // First sort by overdue status
    const aIsOverdue = isPast(new Date(a.dueDate)) && !isToday(new Date(a.dueDate));
    const bIsOverdue = isPast(new Date(b.dueDate)) && !isToday(new Date(b.dueDate));
    
    if (aIsOverdue && !bIsOverdue) return -1;
    if (!aIsOverdue && bIsOverdue) return 1;
    
    // Then sort by completion status
    if (!a.completed && b.completed) return -1;
    if (a.completed && !b.completed) return 1;
    
    return 0;
  });

  return (
    <Card className="bg-white rounded-lg shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Today's Chores</CardTitle>
          <Link href="/my-chores" className="text-primary text-sm hover:underline">
            View All
          </Link>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading || loadingOverdue ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : sortedChores && sortedChores.length > 0 ? (
          <div className="space-y-3">
            {sortedChores.map((chore) => {
              const isChoreOverdue = isPast(new Date(chore.dueDate)) && !isToday(new Date(chore.dueDate));
              
              return (
                <ChoreCard
                  key={chore.id}
                  chore={chore}
                  onComplete={handleChoreComplete}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isOverdue={isChoreOverdue}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No chores scheduled for today</p>
            <p className="mt-2">
              <Link href="#" className="text-primary hover:underline">
                Create a new chore
              </Link>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
