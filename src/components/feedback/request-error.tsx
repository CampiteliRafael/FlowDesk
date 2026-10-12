import type { ReactNode } from "react";

export function RequestError({
  onRetry,
  children = "Ocorreu um erro ao carregar os dados.",
}: {
  onRetry: () => void;
  children?: ReactNode;
}) {
  return (
    <section
      aria-labelledby="request-error-title"
      className="surface-card flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"
      role="alert"
    >
      <div className="flex gap-3">
        <span
          aria-hidden="true"
          className="grid size-10 shrink-0 place-items-center rounded-full bg-rose-50 text-rose-700"
        >
          !
        </span>
        <div>
          <h2 className="text-sm font-semibold text-foreground" id="request-error-title">
            Não foi possível carregar
          </h2>
          <p className="mt-1 max-w-xl text-sm leading-6 text-muted">{children}</p>
        </div>
      </div>
      <button
        className="min-h-10 shrink-0 rounded-lg border border-border px-4 text-sm font-semibold text-slate-700 transition hover:bg-surface-subtle"
        onClick={onRetry}
        type="button"
      >
        Tentar novamente
      </button>
    </section>
  );
}
