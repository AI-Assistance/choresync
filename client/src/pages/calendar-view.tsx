import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, addDays, startOfWeek, startOfDay } from 'date-fns';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import MobileNavigation from '@/components/MobileNavigation';
import AddChoreModal from '@/components/chores/AddChoreModal';
import NotificationsPanel from '@/components/notifications/NotificationsPanel';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function CalendarView() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAddChoreModal, setShowAddChoreModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [choresByDate, setChoresByDate] = useState<Record<string, any[]>>({});

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleAddChoreModal = () => {
    setShowAddChoreModal(!showAddChoreModal);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // Fetch all chores for the calendar view
  const { data: chores, isLoading } = useQuery({
    queryKey: ['/api/chores'],
  });

  useEffect(() => {
    if (chores) {
      // Group chores by date
      const grouped: Record<string, any[]> = {};
      chores.forEach((chore: any) => {
        const dateKey = format(new Date(chore.dueDate), 'yyyy-MM-dd');
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(chore);
      });
      setChoresByDate(grouped);
    }
  }, [chores]);

  return (
    <div className="h-screen flex flex-col md:flex-row bg-gray-50">
      <Sidebar className={showSidebar ? 'block' : ''} />
      
      <main className="flex-1 flex flex-col overflow-hidden mb-16 md:mb-0">
        <TopBar 
          title="Calendar" 
          onToggleSidebar={toggleSidebar}
          onAddChore={toggleAddChoreModal}
          onToggleNotifications={toggleNotifications}
          searchEnabled={false}
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            <Card className="md:col-span-5">
              <CardHeader>
                <CardTitle>Chore Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[350px] w-full" />
                ) : (
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                    components={{
                      DayContent: ({ day }) => {
                        const dateKey = format(day, 'yyyy-MM-dd');
                        const hasChores = choresByDate[dateKey]?.length > 0;
                        return (
                          <div className="flex flex-col h-full">
                            <div>{format(day, 'd')}</div>
                            {hasChores && (
                              <div className="mt-auto">
                                <Badge
                                  variant="secondary"
                                  className={cn(
                                    "absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full",
                                    choresByDate[dateKey].some(c => !c.completed) 
                                      ? "bg-primary" 
                                      : "bg-green-500"
                                  )}
                                >
                                  <span className="sr-only">{choresByDate[dateKey].length} chores</span>
                                </Badge>
                              </div>
                            )}
                          </div>
                        );
                      },
                    }}
                  />
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>
                  {date ? format(date, 'MMMM d, yyyy') : 'Select a Date'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : date ? (
                  <>
                    {choresByDate[format(date, 'yyyy-MM-dd')]?.length > 0 ? (
                      <div className="space-y-3">
                        {choresByDate[format(date, 'yyyy-MM-dd')].map((chore) => (
                          <div 
                            key={chore.id}
                            className="p-3 border rounded-lg"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className={cn("font-medium", chore.completed && "line-through text-gray-400")}>
                                  {chore.name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {chore.estimatedMinutes} min · {chore.category}
                                </p>
                              </div>
                              <Badge variant={chore.completed ? "outline" : "default"}>
                                {chore.completed ? "Done" : "Todo"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-8 text-gray-500">
                        No chores scheduled for this date
                      </p>
                    )}
                    <div className="mt-4">
                      <button 
                        className="w-full py-2 text-primary hover:underline"
                        onClick={toggleAddChoreModal}
                      >
                        Add chore for this day
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-center py-8 text-gray-500">
                    Select a date to view chores
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <MobileNavigation onAddChore={toggleAddChoreModal} />
      </main>

      <AddChoreModal 
        isOpen={showAddChoreModal} 
        onClose={toggleAddChoreModal} 
        initialDate={date}
      />

      <NotificationsPanel 
        isOpen={showNotifications} 
        onClose={toggleNotifications} 
      />
    </div>
  );
}
