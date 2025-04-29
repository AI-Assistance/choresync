import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Clock, AlertCircle, Trophy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSummary() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/stats/dashboard'],
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Completed Today */}
      <div className="bg-white rounded-lg shadow p-4 flex items-center">
        {isLoading ? (
          <div className="w-full flex items-center">
            <Skeleton className="h-12 w-12 rounded-full mr-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-12" />
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-full p-3 bg-primary/10 text-primary">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Completed Today</h3>
              <p className="text-2xl font-semibold">{stats?.completedToday || 0}</p>
            </div>
          </>
        )}
      </div>
      
      {/* Pending */}
      <div className="bg-white rounded-lg shadow p-4 flex items-center">
        {isLoading ? (
          <div className="w-full flex items-center">
            <Skeleton className="h-12 w-12 rounded-full mr-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-12" />
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-full p-3 bg-accent/10 text-accent">
              <Clock className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Pending</h3>
              <p className="text-2xl font-semibold">{stats?.pending || 0}</p>
            </div>
          </>
        )}
      </div>
      
      {/* Overdue */}
      <div className="bg-white rounded-lg shadow p-4 flex items-center">
        {isLoading ? (
          <div className="w-full flex items-center">
            <Skeleton className="h-12 w-12 rounded-full mr-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-12" />
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-full p-3 bg-destructive/10 text-destructive">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Overdue</h3>
              <p className="text-2xl font-semibold">{stats?.overdue || 0}</p>
            </div>
          </>
        )}
      </div>
      
      {/* Your Completion */}
      <div className="bg-white rounded-lg shadow p-4 flex items-center">
        {isLoading ? (
          <div className="w-full flex items-center">
            <Skeleton className="h-12 w-12 rounded-full mr-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-12" />
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-full p-3 bg-secondary/10 text-secondary">
              <Trophy className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Your Completion</h3>
              <p className="text-2xl font-semibold">{stats?.userCompletion || 0}%</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
