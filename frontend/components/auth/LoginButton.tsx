interface LoginButtonProps {
  text?: string;
  loadingText?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function LoginButton({
  text = "Iniciar sesión",
  loadingText = "Procesando...",
  isLoading = false,
  disabled = false,
}: LoginButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled || isLoading}
      className="
        w-full
        rounded-xl
        bg-cyan-600
        py-3
        font-semibold
        text-white
        transition
        hover:bg-cyan-500
        disabled:cursor-not-allowed
        disabled:opacity-60
      "
    >
      {isLoading ? loadingText : text}
    </button>
  );
}