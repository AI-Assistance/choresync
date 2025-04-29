import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./use-auth";

export function useHousehold() {
  const { user } = useAuth();

  const { data: currentHousehold, isLoading, error } = useQuery({
    queryKey: ['/api/households/current'],
    enabled: !!user?.householdId,
  });

  return {
    currentHousehold,
    isLoading,
    error,
  };
}
