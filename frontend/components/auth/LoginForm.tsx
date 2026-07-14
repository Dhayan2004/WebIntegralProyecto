"use client";

import Link from "next/link";
import LoginButton from "./LoginButton";
import LoginInput from "./LoginInput";

export default function LoginForm() {
  return (
    <section className="flex items-center justify-center bg-slate-950 px-8 py-10">

      <div className="w-full max-w-md">

        <h2 className="text-4xl font-black text-white">
          Bienvenido
        </h2>

        <p className="mt-2 text-slate-400">
          Inicia sesión para continuar con tu aprendizaje.
        </p>

        <form className="mt-10 space-y-6">

          <LoginInput
            label="Correo electrónico"
            type="email"
            placeholder="correo@ejemplo.com"
          />

          <LoginInput
            label="Contraseña"
            type="password"
            placeholder="********"
          />


          <LoginButton />

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