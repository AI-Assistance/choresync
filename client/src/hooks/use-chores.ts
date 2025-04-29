import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { InsertChore, Chore } from "@shared/schema";

export function useChores() {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const createChoreMutation = useMutation({
    mutationFn: async (choreData: InsertChore) => {
      setIsCreating(true);
      try {
        const response = await apiRequest("POST", "/api/chores", choreData);
        return response.json();
      } finally {
        setIsCreating(false);
      }
    },
    onSuccess: () => {
      // Invalidate all chore-related queries
      queryClient.invalidateQueries({ queryKey: ['/api/chores'] });
      queryClient.invalidateQueries({ queryKey: ['/api/chores/today'] });
      queryClient.invalidateQueries({ queryKey: ['/api/chores/upcoming'] });
      queryClient.invalidateQueries({ queryKey: ['/api/chores/overdue'] });
      queryClient.invalidateQueries({ queryKey: ['/api/chores/my'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats/dashboard'] });
    },
  });

  const updateChoreMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Chore> }) => {
      setIsUpdating(true);
      try {
        const response = await apiRequest("PATCH", `/api/chores/${id}`, data);
        return response.json();
      } finally {
        setIsUpdating(false);
      }
    },
    onSuccess: () => {
      // Invalidate all chore-related queries
      queryClient.invalidateQueries({ queryKey: ['/api/chores'] });
      queryClient.invalidateQueries({ queryKey: ['/api/chores/today'] });
      queryClient.invalidateQueries({ queryKey: ['/api/chores/upcoming'] });
      queryClient.invalidateQueries({ queryKey: ['/api/chores/overdue'] });
      queryClient.invalidateQueries({ queryKey: ['/api/chores/my'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats/dashboard'] });
    },
  });

  const completeChoreMutation = useMutation({
    mutationFn: async (choreId: number) => {
      const response = await apiRequest("POST", `/api/chores/${choreId}/complete`, {});
      return response.json();
    },
    onSuccess: () => {
      // Invalidate all chore-related queries
      queryClient.invalidateQueries({ queryKey: ['/api/chores'] });
      queryClient.invalidateQueries({ queryKey: ['/api/chores/today'] });
      queryClient.invalidateQueries({ queryKey: ['/api/chores/upcoming'] });
      queryClient.invalidateQueries({ queryKey: ['/api/chores/overdue'] });
      queryClient.invalidateQueries({ queryKey: ['/api/chores/my'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats/dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
    },
  });

  const deleteChoreMutation = useMutation({
    mutationFn: async (choreId: number) => {
      setIsDeleting(true);
      try {
        // Not implemented in the backend yet, but would be a DELETE request
        const response = await apiRequest("DELETE", `/api/chores/${choreId}`, {});
        return response.json();
      } finally {
        setIsDeleting(false);
      }
    },
    onSuccess: () => {
      // Invalidate all chore-related queries
      queryClient.invalidateQueries({ queryKey: ['/api/chores'] });
      queryClient.invalidateQueries({ queryKey: ['/api/chores/today'] });
      queryClient.invalidateQueries({ queryKey: ['/api/chores/upcoming'] });
      queryClient.invalidateQueries({ queryKey: ['/api/chores/overdue'] });
      queryClient.invalidateQueries({ queryKey: ['/api/chores/my'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats/dashboard'] });
    },
  });

  // Listen for WebSocket events to refetch data
  if (typeof window !== 'undefined') {
    window.addEventListener('refetch-chores', () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chores'] });
      queryClient.invalidateQueries({ queryKey: ['/api/chores/today'] });
      queryClient.invalidateQueries({ queryKey: ['/api/chores/upcoming'] });
      queryClient.invalidateQueries({ queryKey: ['/api/chores/overdue'] });
      queryClient.invalidateQueries({ queryKey: ['/api/chores/my'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats/dashboard'] });
    });
  }

  return {
    createChore: createChoreMutation.mutateAsync,
    updateChore: updateChoreMutation.mutateAsync,
    markChoreAsComplete: completeChoreMutation.mutateAsync,
    removeChore: deleteChoreMutation.mutateAsync,
    isCreating,
    isUpdating,
    isDeleting,
  };
}
