import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./lib/auth";
import { SocketProvider } from "./lib/socket";

// Pages
import NotFound from "@/pages/not-found";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import CreateHousehold from "@/pages/auth/create-household";
import Dashboard from "@/pages/dashboard";
import MyChores from "@/pages/my-chores";
import CalendarView from "@/pages/calendar-view";
import Household from "@/pages/household";
import Statistics from "@/pages/statistics";
import Settings from "@/pages/settings";

// Layout components
import ProtectedRoute from "./components/ProtectedRoute";

function Router() {
  return (
    <Switch>
      {/* Auth routes */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/create-household">
        {() => (
          <ProtectedRoute>
            <CreateHousehold />
          </ProtectedRoute>
        )}
      </Route>
      
      {/* App routes */}
      <Route path="/">
        {() => (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/my-chores">
        {() => (
          <ProtectedRoute>
            <MyChores />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/calendar">
        {() => (
          <ProtectedRoute>
            <CalendarView />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/household">
        {() => (
          <ProtectedRoute>
            <Household />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/statistics">
        {() => (
          <ProtectedRoute>
            <Statistics />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/settings">
        {() => (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        )}
      </Route>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
