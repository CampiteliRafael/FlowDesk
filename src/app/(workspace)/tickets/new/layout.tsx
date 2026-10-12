import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Nova solicitação",
};

export default function NewTicketLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div
          aria-label="Carregando formulário"
          className="surface-card min-h-96 animate-pulse"
        />
      }
    >
      {children}
    </Suspense>
  );
}
