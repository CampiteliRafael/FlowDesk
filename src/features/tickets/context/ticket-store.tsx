"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

type DemoNetworkContextValue = {
  simulateFailures: boolean;
  toggleFailureSimulation: () => void;
};

const DemoNetworkContext = createContext<DemoNetworkContextValue | null>(null);

export function TicketStoreProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            staleTime: 0,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: false,
          },
        },
      }),
  );
  const [simulateFailures, setSimulateFailures] = useState(false);

  function toggleFailureSimulation() {
    setSimulateFailures((enabled) => !enabled);
  }

  return (
    <DemoNetworkContext.Provider
      value={{ simulateFailures, toggleFailureSimulation }}
    >
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </DemoNetworkContext.Provider>
  );
}

export function useDemoNetworkScenario() {
  const scenario = useContext(DemoNetworkContext);
  if (!scenario) {
    throw new Error(
      "useDemoNetworkScenario precisa estar dentro de TicketStoreProvider.",
    );
  }
  return scenario;
}
