import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import MobileNavigation from '@/components/MobileNavigation';
import AddChoreModal from '@/components/chores/AddChoreModal';
import NotificationsPanel from '@/components/notifications/NotificationsPanel';
import { ChoreCard } from '@/components/ui/chore-card';
import { useChores } from '@/hooks/use-chores';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function MyChores() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAddChoreModal, setShowAddChoreModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { toast } = useToast();
  const { markChoreAsComplete } = useChores();
  
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleAddChoreModal = () => {
    setShowAddChoreModal(!showAddChoreModal);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };
  
  const { data: myChores, isLoading: loadingMyChores } = useQuery({
    queryKey: ['/api/chores/my'],
  });
  
  const { data: overdueChores, isLoading: loadingOverdue } = useQuery({
    queryKey: ['/api/chores/overdue'],
  });

  const handleChoreComplete = async (choreId: number) => {
    try {
      await markChoreAsComplete(choreId);
      toast({
        title: "Chore completed!",
        description: "Nice job! The chore has been marked as complete.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark chore as complete. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const isLoading = loadingMyChores || loadingOverdue;

  return (
    <div className="h-screen flex flex-col md:flex-row bg-gray-50">
      <Sidebar className={showSidebar ? 'block' : ''} />
      
      <main className="flex-1 flex flex-col overflow-hidden mb-16 md:mb-0">
        <TopBar 
          title="My Chores" 
          onToggleSidebar={toggleSidebar}
          onAddChore={toggleAddChoreModal}
          onToggleNotifications={toggleNotifications}
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <Tabs defaultValue="assigned">
            <TabsList className="mb-4">
              <TabsTrigger value="assigned">Assigned to Me</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
            </TabsList>
            
            <TabsContent value="assigned">
              <Card>
                <CardHeader>
                  <CardTitle>Chores Assigned to Me</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : myChores && myChores.length > 0 ? (
                    <div className="space-y-3">
                      {myChores.map((chore) => (
                        <ChoreCard
                          key={chore.id}
                          chore={chore}
                          onComplete={() => handleChoreComplete(chore.id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>You don't have any chores assigned to you right now.</p>
                      <p className="mt-2">
                        <button 
                          className="text-primary hover:underline"
                          onClick={toggleAddChoreModal}
                        >
                          Create a new chore
                        </button>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="overdue">
              <Card>
                <CardHeader>
                  <CardTitle>Overdue Chores</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : overdueChores && overdueChores.length > 0 ? (
                    <div className="space-y-3">
                      {overdueChores.map((chore) => (
                        <ChoreCard
                          key={chore.id}
                          chore={chore}
                          onComplete={() => handleChoreComplete(chore.id)}
                          isOverdue={true}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>You don't have any overdue chores. Great job!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
