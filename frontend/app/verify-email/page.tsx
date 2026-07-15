import { Suspense } from "react";

import VerifyEmailContainer from "@/components/auth/VerifyEmailContainer";

function VerifyEmailFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-10">
      <section className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-xl sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10">
          <span className="text-lg font-black text-cyan-400">
            ...
          </span>
        </div>

        <h1 className="mt-6 text-3xl font-black text-white">
          Verificando correo
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-slate-400">
          Estamos preparando la verificación de tu cuenta.
        </p>
      </section>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailFallback />}>
      <VerifyEmailContainer />
    </Suspense>
  );
}