import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChoreCard } from "@/components/ui/chore-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useHousehold } from "@/hooks/use-household";

export default function UpcomingChores() {
  const { currentHousehold } = useHousehold();
  
  const { data: upcomingChores, isLoading } = useQuery({
    queryKey: ['/api/chores/upcoming'],
  });

  return (
    <Card className="bg-white rounded-lg shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Upcoming Chores</CardTitle>
          <Link href="/calendar" className="text-primary text-sm hover:underline">
            Open Calendar
          </Link>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : upcomingChores && upcomingChores.length > 0 ? (
          <div className="space-y-3">
            {upcomingChores.map((chore) => {
              const assignedUser = currentHousehold?.members.find(
                (m) => m.id === chore.assignedToId
              );
              
              return (
                <ChoreCard
                  key={chore.id}
                  chore={chore}
                  variant="upcoming"
                  showAssignee={true}
                  assigneeName={assignedUser?.fullName || "Unassigned"}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No upcoming chores scheduled</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
