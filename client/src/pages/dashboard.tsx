import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import MobileNavigation from '@/components/MobileNavigation';
import DashboardSummary from '@/components/chores/DashboardSummary';
import ChoreDistribution from '@/components/chores/ChoreDistribution';
import TodaysChores from '@/components/chores/TodaysChores';
import UpcomingChores from '@/components/chores/UpcomingChores';
import AddChoreModal from '@/components/chores/AddChoreModal';
import NotificationsPanel from '@/components/notifications/NotificationsPanel';
import { useChores } from '@/hooks/use-chores';
import { useHousehold } from '@/hooks/use-household';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAddChoreModal, setShowAddChoreModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { toast } = useToast();
  const { markChoreAsComplete } = useChores();
  const { currentHousehold } = useHousehold();

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleAddChoreModal = () => {
    setShowAddChoreModal(!showAddChoreModal);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

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

  return (
    <div className="h-screen flex flex-col md:flex-row bg-gray-50">
      <Sidebar className={showSidebar ? 'block' : ''} />
      
      <main className="flex-1 flex flex-col overflow-hidden mb-16 md:mb-0">
        <TopBar 
          title="Dashboard" 
          onToggleSidebar={toggleSidebar}
          onAddChore={toggleAddChoreModal}
          onToggleNotifications={toggleNotifications}
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <DashboardSummary />
          
          <ChoreDistribution />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <TodaysChores onChoreComplete={handleChoreComplete} />
            <UpcomingChores />
          </div>
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
