import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import MobileNavigation from '@/components/MobileNavigation';
import AddChoreModal from '@/components/chores/AddChoreModal';
import NotificationsPanel from '@/components/notifications/NotificationsPanel';
import UserAvatar from '@/components/ui/user-avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useHousehold } from '@/hooks/use-household';
import { Loader2 } from 'lucide-react';
import { ChoreCard } from '@/components/ui/chore-card';
import { Progress } from '@/components/ui/progress';

export default function Household() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAddChoreModal, setShowAddChoreModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { currentHousehold, isLoading: loadingHousehold } = useHousehold();

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleAddChoreModal = () => {
    setShowAddChoreModal(!showAddChoreModal);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const { data: chores, isLoading: loadingChores } = useQuery({
    queryKey: ['/api/chores'],
  });

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['/api/stats/dashboard'],
  });

  const isLoading = loadingHousehold || loadingChores || loadingStats;

  return (
    <div className="h-screen flex flex-col md:flex-row bg-gray-50">
      <Sidebar className={showSidebar ? 'block' : ''} />
      
      <main className="flex-1 flex flex-col overflow-hidden mb-16 md:mb-0">
        <TopBar 
          title="Household" 
          onToggleSidebar={toggleSidebar}
          onAddChore={toggleAddChoreModal}
          onToggleNotifications={toggleNotifications}
          searchEnabled={false}
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : currentHousehold ? (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>{currentHousehold.household.name}</CardTitle>
                  <CardDescription>
                    {currentHousehold.members.length} household member{currentHousehold.members.length !== 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {currentHousehold.members.map((member) => (
                      <div key={member.id} className="flex flex-col items-center p-4 border rounded-lg">
                        <UserAvatar 
                          user={member} 
                          className="h-16 w-16" 
                        />
                        <h3 className="mt-3 font-medium">{member.fullName}</h3>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="members">
                <TabsList className="mb-4">
                  <TabsTrigger value="members">Member Performance</TabsTrigger>
                  <TabsTrigger value="chores">All Household Chores</TabsTrigger>
                </TabsList>
                
                <TabsContent value="members">
                  <Card>
                    <CardHeader>
                      <CardTitle>Chore Completion by Member</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {stats?.memberDistribution?.length > 0 ? (
                        <div className="space-y-6">
                          {stats.memberDistribution.map((member) => (
                            <div key={member.id} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <UserAvatar 
                                    user={{
                                      fullName: member.fullName,
                                      avatarColor: member.avatarColor
                                    }} 
                                    className="h-8 w-8 mr-3" 
                                  />
                                  <span className="font-medium">{member.fullName}</span>
                                </div>
                                <span className="font-semibold">{member.percentage}%</span>
                              </div>
                              <Progress value={member.percentage} className="h-2" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center py-4 text-gray-500">
                          No chore completion data available yet
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="chores">
                  <Card>
                    <CardHeader>
                      <CardTitle>All Household Chores</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {chores?.length > 0 ? (
                        <div className="space-y-3">
                          {chores.map((chore) => {
                            const assignee = currentHousehold.members.find(
                              (m) => m.id === chore.assignedToId
                            );
                            
                            return (
                              <ChoreCard
                                key={chore.id}
                                chore={chore}
                                variant="upcoming"
                                showAssignee={true}
                                assigneeName={assignee?.fullName}
                              />
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-center py-8 text-gray-500">
                          No chores have been created yet
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Household</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-gray-500">
                  You are not currently part of a household
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <MobileNavigation onAddChore={toggleAddChoreModal} />
      </main>

      <AddChoreModal 
        isOpen={showAddChoreModal} 
        onClose={toggleAddChoreModal} 
      />

      <NotificationsPanel 
        isOpen={showNotifications} 
        onClose={toggleNotifications} 
      />
    </div>
  );
}
