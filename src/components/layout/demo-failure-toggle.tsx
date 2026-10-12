"use client";

import { useDemoNetworkScenario } from "@/features/tickets/context/ticket-store";

export function DemoFailureToggle() {
  const { simulateFailures, toggleFailureSimulation } = useDemoNetworkScenario();

  return (
    <button
      aria-pressed={simulateFailures}
      aria-label={
        simulateFailures
          ? "Desativar simulação de falha da API"
          : "Ativar simulação de falha da API"
      }
      className={`inline-flex min-h-9 items-center gap-2 rounded-full border px-3 text-xs font-medium transition ${
        simulateFailures
          ? "border-rose-200 bg-rose-50 text-rose-800"
          : "border-border bg-surface-subtle text-muted hover:text-foreground"
      }`}
      onClick={toggleFailureSimulation}
      title="Alterna falhas previsíveis da API demonstrativa"
      type="button"
    >
      <span
        aria-hidden="true"
        className={`size-1.5 rounded-full ${
          simulateFailures ? "bg-rose-500" : "bg-emerald-500"
        }`}
      />
      <span className="hidden sm:inline">
        {simulateFailures ? "Falha de API ativa" : "Simular falha de API"}
      </span>
      <span className="sm:hidden">{simulateFailures ? "API: erro" : "API"}</span>
    </button>
  );
}
