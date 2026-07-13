interface SuggestedPromptsProps {
    onSelectPrompt: (prompt: string) => void;
  }
  
  const prompts = [
    "Explícame este tema de forma sencilla",
    "Dame un ejemplo práctico",
    "Crea cinco preguntas para estudiar",
    "Resume los conceptos principales",
  ];
  
  export default function SuggestedPrompts({
    onSelectPrompt,
  }: SuggestedPromptsProps) {
    return (
      <section className="px-5 pb-4 sm:px-6">
        <p className="text-helper mb-3 text-xs">
          Preguntas sugeridas
        </p>
  
        <div className="flex gap-2 overflow-x-auto pb-1">
          {prompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => onSelectPrompt(prompt)}
              className="text-nav shrink-0 rounded-full border border-brand-border bg-brand-card px-4 py-2 text-xs text-dark-body transition hover:border-brand-cyan-light hover:text-brand-cyan"
            >
              {prompt}
            </button>
          ))}
        </div>
      </section>
    );
  }