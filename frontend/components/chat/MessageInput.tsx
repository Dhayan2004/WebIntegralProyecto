"use client";

import {
  useState,
  type FormEvent,
} from "react";

interface MessageInputProps {
  initialValue?: string;
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function MessageInput({
  initialValue = "",
  onSend,
  disabled = false,
}: MessageInputProps) {
  const [message, setMessage] =
    useState(initialValue);

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const cleanMessage = message.trim();

    if (!cleanMessage) {
      return;
    }

    onSend(cleanMessage);
    setMessage("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-brand-border bg-brand-card px-5 py-4 sm:px-6"
    >
      <div className="mx-auto flex w-full max-w-3xl items-end gap-3 rounded-2xl border border-brand-border bg-brand-bg p-2 transition focus-within:border-brand-cyan focus-within:ring-2 focus-within:ring-brand-cyan-light">
        <button
          type="button"
          aria-label="Adjuntar documento"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-dark-muted transition hover:bg-brand-card hover:text-brand-cyan"
        >
          <span aria-hidden="true" className="text-xl">
            +
          </span>
        </button>

        <textarea
          rows={1}
          value={message}
          onChange={(event) =>
            setMessage(event.target.value)
          }
          placeholder="Escribe tu pregunta..."
          className="text-helper max-h-32 min-h-11 flex-1 resize-none bg-transparent px-2 py-3 text-sm outline-none placeholder:text-dark-muted"
        />

        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="text-nav flex h-11 shrink-0 items-center justify-center rounded-xl bg-brand-cyan px-5 text-sm text-white transition hover:bg-brand-cyan-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          Enviar
        </button>
      </div>

      <p className="text-helper mt-2 text-center text-[10px]">
        La IA puede cometer errores. Verifica la información importante.
      </p>
    </form>
  );
}