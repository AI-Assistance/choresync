import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import UserAvatar from "@/components/ui/user-avatar";

export default function ChoreDistribution() {
  const [timeframe, setTimeframe] = useState("week");
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/stats/dashboard'],
  });

  return (
    <Card className="bg-white rounded-lg shadow p-4 md:p-6 mb-6">
      <CardHeader className="p-0 pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Household Chore Distribution</CardTitle>
          <div className="text-sm text-gray-500">
            <Select
              value={timeframe}
              onValueChange={setTimeframe}
            >
              <SelectTrigger className="border border-gray-300 rounded h-8 px-2 w-[150px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Pie Chart */}
          <div className="flex-1 flex justify-center items-center">
            {isLoading ? (
              <Skeleton className="w-48 h-48 rounded-full" />
            ) : stats?.memberDistribution && stats.memberDistribution.length > 0 ? (
              <div className="w-48 h-48 rounded-full border-8 border-primary relative flex items-center justify-center"
                style={{
                  borderLeftColor: '#10B981',
                  borderRightColor: '#F59E0B',
                  borderBottomColor: '#EF4444',
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-medium">Distribution</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No distribution data available</p>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex-1">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : stats?.memberDistribution && stats.memberDistribution.length > 0 ? (
              <ul className="space-y-3">
                {stats.memberDistribution.map((member) => (
                  <li key={member.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <UserAvatar
                        user={{
                          fullName: member.fullName,
                          avatarColor: member.avatarColor
                        }}
                        className="w-8 h-8"
                      />
                      <span className="ml-3 font-medium">{member.fullName}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-semibold">{member.percentage}%</span>
                      <div className="w-24 bg-gray-200 rounded-full h-2 ml-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${member.percentage}%`,
                            backgroundColor: member.avatarColor
                          }}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No chore distribution data available</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
