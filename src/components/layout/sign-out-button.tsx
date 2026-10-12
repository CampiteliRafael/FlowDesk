"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export function SignOutButton() {
  const router = useRouter();
  const queryClient = useQueryClient();

  function signOut() {
    queryClient.clear();
    router.replace("/");
  }

  return (
    <button
      aria-label="Sair da conta"
      className="inline-flex min-h-9 items-center gap-2 rounded-lg px-2.5 text-sm font-medium text-slate-600 transition hover:bg-surface-subtle hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      onClick={signOut}
      type="button"
    >
      <svg
        aria-hidden="true"
        fill="none"
        height="17"
        viewBox="0 0 20 20"
        width="17"
      >
        <path
          d="M8 3H4.5A1.5 1.5 0 0 0 3 4.5v11A1.5 1.5 0 0 0 4.5 17H8m4-3 4-4-4-4m4 4H7"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.6"
        />
      </svg>
      <span className="hidden sm:inline">Sair</span>
    </button>
  );
}
