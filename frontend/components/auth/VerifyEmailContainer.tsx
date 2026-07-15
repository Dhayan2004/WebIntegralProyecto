"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";

import { authService } from "@/services/auth.service";

type VerificationStatus =
  | "loading"
  | "success"
  | "error";

export default function VerifyEmailContainer() {
  const searchParams = useSearchParams();

  const hasStarted = useRef(false);

  const [status, setStatus] =
    useState<VerificationStatus>(
      "loading",
    );

  const [message, setMessage] =
    useState(
      "Estamos verificando tu correo...",
    );

  useEffect(() => {
    if (hasStarted.current) {
      return;
    }

    hasStarted.current = true;

    const token =
      searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage(
        "No se encontró un token de verificación.",
      );
      return;
    }

    async function verify() {
      try {
        const response =
          await authService.verifyEmail(
            token as string,
          );

        setStatus("success");
        setMessage(response.message);
      } catch (requestError) {
        setStatus("error");

        setMessage(
          requestError instanceof Error
            ? requestError.message
            : "No fue posible verificar el correo.",
        );
      }
    }

    void verify();
  }, [searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-10">
      <section className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-xl sm:p-10">
        <div
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${
            status === "success"
              ? "bg-emerald-500/10"
              : status === "error"
                ? "bg-red-500/10"
                : "bg-cyan-500/10"
          }`}
        >
          <span
            className={`text-lg font-black ${
              status === "success"
                ? "text-emerald-400"
                : status === "error"
                  ? "text-red-400"
                  : "text-cyan-400"
            }`}
          >
            {status === "success"
              ? "OK"
              : status === "error"
                ? "!"
                : "..."}
          </span>
        </div>

        <h1 className="mt-6 text-3xl font-black text-white">
          {status === "loading"
            ? "Verificando correo"
            : status === "success"
              ? "Correo verificado"
              : "No se pudo verificar"}
        </h1>

        <p
          className={`mt-4 text-sm leading-relaxed ${
            status === "success"
              ? "text-emerald-300"
              : status === "error"
                ? "text-red-300"
                : "text-slate-400"
          }`}
        >
          {message}
        </p>

        {status !== "loading" && (
          <Link
            href="/login"
            className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-cyan-600 px-6 py-3 font-semibold text-white transition hover:bg-cyan-500"
          >
            Ir al inicio de sesión
          </Link>
        )}
      </section>
    </main>
  );
}