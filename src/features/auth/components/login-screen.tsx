"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type SubmitEvent } from "react";

export default function LoginScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const [previousPathname, setPreviousPathname] = useState(pathname);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  if (previousPathname !== pathname) {
    setPreviousPathname(pathname);
    setIsSubmitting(false);
    setMessage("");
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("Abrindo o ambiente de demonstração...");
    await new Promise((resolve) => window.setTimeout(resolve, 350));
    router.push("/dashboard");
  }

  return (
    <main className="grid min-h-screen bg-surface lg:grid-cols-[minmax(0,1fr)_minmax(460px,0.85fr)]">
      <section className="relative hidden overflow-hidden bg-[#191a35] px-12 py-12 text-white lg:flex lg:flex-col lg:justify-between xl:px-20">
        <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-36 size-[480px] rounded-full border border-white/10" />
        <div aria-hidden="true" className="pointer-events-none absolute -left-12 top-56 size-[320px] rounded-full border border-white/10" />
        <div aria-hidden="true" className="pointer-events-none absolute bottom-[-180px] right-[-130px] size-[440px] rounded-full bg-primary/25 blur-3xl" />

        <Link className="relative inline-flex w-fit items-center gap-3" href="/">
          <span aria-hidden="true" className="grid size-11 place-items-center rounded-[14px] bg-primary text-white shadow-lg shadow-black/20">
            <svg fill="none" height="22" viewBox="0 0 24 24" width="22">
              <path d="M6 18V6h12M6 12h9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </svg>
          </span>
          <span className="text-xl font-bold tracking-tight">FlowDesk</span>
        </Link>

        <div className="relative max-w-xl py-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-indigo-100">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-400" />
            Seu trabalho, em fluxo
          </span>
          <h1 className="mt-7 text-5xl font-bold leading-[1.1] tracking-[-0.05em] xl:text-[58px]">
            Mais clareza.
            <br />
            Menos filas.
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-indigo-100/75">
            Um espaço simples para organizar solicitações, dar visibilidade ao
            trabalho e manter sua equipe em movimento.
          </p>

          <div className="mt-11 max-w-md rounded-2xl border border-white/10 bg-white/[0.07] p-5 shadow-2xl shadow-black/10 backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-indigo-100/65">Fila da equipe</p>
                <p className="mt-1 text-lg font-semibold">Resumo de hoje</p>
              </div>
              <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                Atualizado
              </span>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { label: "Abertas", value: "12" },
                { label: "Em andamento", value: "08" },
                { label: "Resolvidas", value: "24" },
              ].map((item) => (
                <div className="rounded-xl border border-white/[0.08] bg-black/10 p-3" key={item.label}>
                  <p className="text-[11px] text-indigo-100/60">{item.label}</p>
                  <p className="mt-2 text-2xl font-bold tracking-tight">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-2">
              <span className="flex -space-x-2" aria-hidden="true">
                {["MC", "RL", "AC"].map((initials, index) => (
                  <span
                    className={`grid size-7 place-items-center rounded-full border-2 border-[#292a49] text-[9px] font-bold ${
                      index === 0 ? "bg-[#f4c7a8] text-[#65452e]" : index === 1 ? "bg-[#c6c8f2] text-[#373963]" : "bg-[#c5e5d6] text-[#365b4d]"
                    }`}
                    key={initials}
                  >
                    {initials}
                  </span>
                ))}
              </span>
              <span className="text-xs text-indigo-100/65">Sua equipe, em sincronia</span>
            </div>
          </div>
        </div>

        <p className="relative text-xs text-indigo-100/50">
          FlowDesk · Demonstração de produto
        </p>
      </section>

      <section className="flex min-h-screen flex-col justify-center px-5 py-10 sm:px-12 lg:px-14 xl:px-24">
        <Link className="mb-12 inline-flex w-fit items-center gap-2.5 lg:hidden" href="/">
          <span aria-hidden="true" className="grid size-9 place-items-center rounded-xl bg-primary text-white">
            <svg fill="none" height="19" viewBox="0 0 24 24" width="19">
              <path d="M6 18V6h12M6 12h9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </svg>
          </span>
          <span className="text-lg font-bold tracking-tight">FlowDesk</span>
        </Link>

        <div className="mx-auto w-full max-w-[400px]">
          <div className="mb-8 grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary">
            <svg aria-hidden="true" fill="none" height="22" viewBox="0 0 24 24" width="22">
              <path d="M15 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM5 20a7 7 0 0 1 14 0" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
            </svg>
          </div>
          <p className="eyebrow">Bem-vindo de volta</p>
          <h2 className="mt-2 text-[32px] font-bold tracking-[-0.04em] text-foreground">
            Entre na sua conta
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Acesse o espaço de trabalho da sua equipe.
          </p>

          <div className="mt-6 flex gap-3 rounded-xl border border-primary/10 bg-primary-soft/70 p-3.5">
            <svg aria-hidden="true" className="mt-0.5 shrink-0 text-primary" fill="none" height="17" viewBox="0 0 20 20" width="17">
              <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10 9v4m0-6h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
            </svg>
            <p className="text-xs leading-5 text-primary-strong">
              Esta é uma demonstração. Nenhuma credencial é validada, salva ou enviada.
            </p>
          </div>

          <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700" htmlFor="login-email">
                E-mail
              </label>
              <input
                autoComplete="email"
                className="control w-full px-3.5 text-sm"
                id="login-email"
                name="email"
                placeholder="voce@empresa.com"
                required
                type="email"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label className="block text-sm font-semibold text-slate-700" htmlFor="login-password">
                  Senha
                </label>
                <button
                  className="text-xs font-semibold text-primary hover:text-primary-strong"
                  onClick={() =>
                    setMessage("A recuperação de senha não está disponível na demonstração.")
                  }
                  type="button"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <input
                  autoComplete="current-password"
                  className="control w-full px-3.5 pr-16 text-sm"
                  id="login-password"
                  name="password"
                  placeholder="Digite qualquer senha"
                  required
                  type={showPassword ? "text" : "password"}
                />
                <button
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-0 rounded-r-[10px] px-3 text-xs font-semibold text-muted hover:text-foreground"
                  onClick={() => setShowPassword((visible) => !visible)}
                  type="button"
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            <button
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-primary px-4 text-sm font-semibold text-white shadow-[0_5px_12px_rgb(91_85_231/18%)] transition hover:bg-primary-strong disabled:cursor-wait disabled:opacity-70"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                  Acessando...
                </>
              ) : (
                <>
                  Acessar demonstração
                  <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 20 20" width="16">
                    <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
                  </svg>
                </>
              )}
            </button>
            {message ? (
              <p aria-live="polite" className="text-center text-sm text-muted" role="status">
                {message}
              </p>
            ) : null}
          </form>

          <p className="mt-8 text-center text-xs leading-5 text-muted">
            Ao continuar, você acessa somente o workspace demonstrativo do FlowDesk.
          </p>
        </div>

        <p className="mx-auto mt-12 w-full max-w-[400px] text-center text-xs text-muted">
          © 2026 FlowDesk · Projeto de demonstração
        </p>
      </section>
    </main>
  );
}
