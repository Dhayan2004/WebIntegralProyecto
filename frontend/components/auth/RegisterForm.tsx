"use client";

import Link from "next/link";
import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import LoginButton from "./LoginButton";
import LoginInput from "./LoginInput";
import { authService } from "@/services/auth.service";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  organizationSlug: string;
  acceptTerms: boolean;
}

const initialFormData: RegisterFormData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  organizationSlug: "",
  acceptTerms: false,
};

export default function RegisterForm() {
  const [formData, setFormData] =
    useState<RegisterFormData>(
      initialFormData,
    );

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState(false);

  function handleChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const { name, value, type, checked } =
      event.target;

    setFormData((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError(null);

    if (formData.name.trim().length < 2) {
      setError(
        "Ingresa un nombre válido.",
      );
      return;
    }

    if (!formData.email.trim()) {
      setError(
        "Ingresa tu correo electrónico.",
      );
      return;
    }

    if (formData.password.length < 8) {
      setError(
        "La contraseña debe tener al menos 8 caracteres.",
      );
      return;
    }

    if (
      !/[A-Z]/.test(formData.password) ||
      !/[0-9]/.test(formData.password)
    ) {
      setError(
        "La contraseña debe incluir una mayúscula y un número.",
      );
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError(
        "Las contraseñas no coinciden.",
      );
      return;
    }

    if (
      !/^[a-z0-9-]+$/.test(
        formData.organizationSlug,
      )
    ) {
      setError(
        "La organización solo puede contener letras minúsculas, números y guiones.",
      );
      return;
    }

    if (!formData.acceptTerms) {
      setError(
        "Debes aceptar los términos y condiciones.",
      );
      return;
    }

    try {
      setIsLoading(true);

      await authService.register({
        name: formData.name.trim(),
        email: formData.email
          .trim()
          .toLowerCase(),
        password: formData.password,
        organization_slug:
          formData.organizationSlug,
        accept_terms:
          formData.acceptTerms,
      });

      setSuccess(true);
      setFormData(initialFormData);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No fue posible crear la cuenta.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-slate-950 px-8 py-10">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10">
            <span className="text-xl font-black text-cyan-400">
              OK
            </span>
          </div>

          <h2 className="mt-6 text-3xl font-black text-white">
            Revisa tu correo
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Te enviamos un enlace para
            verificar tu cuenta. Debes
            confirmar tu correo antes de
            iniciar sesión.
          </p>

          <Link
            href="/login"
            className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-cyan-600 px-5 py-3 font-semibold text-white transition hover:bg-cyan-500"
          >
            Ir al inicio de sesión
          </Link>

          <button
            type="button"
            onClick={() =>
              setSuccess(false)
            }
            className="mt-4 text-sm font-semibold text-cyan-400 hover:text-cyan-300"
          >
            Registrar otra cuenta
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-950 px-8 py-10">
      <div className="w-full max-w-md">
        <h2 className="text-4xl font-black text-white">
          Crear cuenta
        </h2>

        <p className="mt-2 text-slate-400">
          Regístrate para comenzar tu
          aprendizaje.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6"
        >
          <LoginInput
            label="Nombre completo"
            name="name"
            type="text"
            placeholder="Aarón Balam"
            value={formData.name}
            onChange={handleChange}
          />

          <LoginInput
            label="Correo electrónico"
            name="email"
            type="email"
            placeholder="correo@email.com"
            value={formData.email}
            onChange={handleChange}
          />

          <LoginInput
            label="Organización"
            name="organizationSlug"
            type="text"
            placeholder="utcancun"
            value={
              formData.organizationSlug
            }
            onChange={handleChange}
          />

          <p className="-mt-4 text-xs text-slate-500">
            Usa minúsculas, números o
            guiones. Ejemplo: utcancun.
          </p>

          <LoginInput
            label="Contraseña"
            name="password"
            type="password"
            placeholder="********"
            value={formData.password}
            onChange={handleChange}
          />

          <LoginInput
            label="Confirmar contraseña"
            name="confirmPassword"
            type="password"
            placeholder="********"
            value={
              formData.confirmPassword
            }
            onChange={handleChange}
          />

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={
                formData.acceptTerms
              }
              onChange={handleChange}
              className="mt-1 h-4 w-4 rounded border-white/20 bg-white/10 accent-cyan-500"
            />

            <span className="text-sm leading-relaxed text-slate-400">
              Acepto los términos y
              condiciones de StudyBuddy AI.
            </span>
          </label>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
            >
              {error}
            </div>
          )}

          <LoginButton
            text="Crear cuenta"
            loadingText="Creando cuenta..."
            isLoading={isLoading}
            disabled={isLoading}
          />
        </form>

        <p className="mt-8 text-center text-slate-400">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/login"
            className="font-semibold text-cyan-400 hover:text-cyan-300"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </section>
  );
}