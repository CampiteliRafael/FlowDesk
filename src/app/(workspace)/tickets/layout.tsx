import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Solicitações",
};

export default function TicketsLayout({ children }: { children: ReactNode }) {
  return children;
}
