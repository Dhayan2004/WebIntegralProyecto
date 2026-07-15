"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import LoginButton from "./LoginButton";
import LoginInput from "./LoginInput";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/auth.service";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();
  const { refresh } = useAuth();

  const [formData, setFormData] =
    useState<LoginFormData>({
      email: "",
      password: "",
    });

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  function handleChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError(null);

    if (!formData.email.trim()) {
      setError("Ingresa tu correo electrónico.");
      return;
    }

    if (!formData.password) {
      setError("Ingresa tu contraseña.");
      return;
    }

    try {
      setIsLoading(true);

      await authService.login({
        email: formData.email.trim(),
        password: formData.password,
      });

      await refresh();
      router.push("/dashboard");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No fue posible iniciar sesión.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="flex items-center justify-center bg-slate-950 px-8 py-10">
      <div className="w-full max-w-md">
        <h2 className="text-4xl font-black text-white">
          Bienvenido
        </h2>

        <p className="mt-2 text-slate-400">
          Inicia sesión para continuar con tu aprendizaje.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6"
        >
          <LoginInput
            label="Correo electrónico"
            name="email"
            type="email"
            placeholder="correo@ejemplo.com"
            value={formData.email}
            onChange={handleChange}
          />

          <LoginInput
            label="Contraseña"
            name="password"
            type="password"
            placeholder="********"
            value={formData.password}
            onChange={handleChange}
          />

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
            >
              {error}
            </div>
          )}

          <LoginButton
            isLoading={isLoading}
            loadingText="Iniciando sesión..."
            disabled={
              !formData.email.trim() ||
              !formData.password
            }
          />
        </form>

        <p className="mt-8 text-center text-slate-400">
          ¿No tienes una cuenta?{" "}
          <Link
            href="/register"
            className="font-semibold text-cyan-400 hover:text-cyan-300"
          >
            Crear cuenta
          </Link>
        </p>
      </div>
    </section>
  );
}