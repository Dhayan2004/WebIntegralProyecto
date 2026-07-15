"use client";

import { useEffect, useState } from "react";

import WorkspaceShell from "@/components/common/WorkspaceShell";
import QuizList from "@/components/quizzes/QuizList";
import QuizzesHeader from "@/components/quizzes/QuizzesHeader";
import StartQuizModal from "@/components/quizzes/StartQuizModal";
import { useAuth } from "@/hooks/useAuth";
import { quizService } from "@/services/quizService";
import type {
  QuizApi,
  QuizQuestion,
} from "@/types/quiz";

export default function QuizzesContainer() {
  const { user } = useAuth();
  const userName = user?.name ?? "Usuario";
  const [quizzes, setQuizzes] = useState<QuizApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<
    QuizQuestion | null
  >(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<
    string | null
  >(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    quizService
      .getAll()
      .then(setQuizzes)
      .catch((err) =>
        setError(
          err instanceof Error
            ? err.message
            : "Error al cargar cuestionarios",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  function handleGenerate(newQuizzes: QuizApi[]) {
    setQuizzes((prev) => [...newQuizzes, ...prev]);
    setIsModalOpen(false);
  }

  function startQuiz() {
    if (quizzes.length === 0) return;
    const shuffled = [...quizzes].sort(
      () => Math.random() - 0.5,
    );
    setActiveQuiz({
      id: shuffled[0].id,
      question: shuffled[0].question,
      options: shuffled[0].options,
      correct_answer: shuffled[0].correct_answer,
    });
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
  }

  function handleAnswer(answer: string) {
    if (answered) return;
    setSelectedAnswer(answer);
    setAnswered(true);
    if (answer === activeQuiz?.correct_answer) {
      setScore((s) => s + 1);
    }
  }

  function handleNext() {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex >= quizzes.length) {
      setActiveQuiz(null);
      return;
    }
    const q = quizzes[nextIndex];
    setActiveQuiz({
      id: q.id,
      question: q.question,
      options: q.options,
      correct_answer: q.correct_answer,
    });
    setCurrentQuestionIndex(nextIndex);
    setSelectedAnswer(null);
    setAnswered(false);
  }

  return (
    <WorkspaceShell userName={userName}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <QuizzesHeader
          totalQuizzes={quizzes.length}
          onCreateQuiz={() => setIsModalOpen(true)}
        />

        {loading && (
          <p className="text-helper text-center text-sm py-12">
            Cargando cuestionarios...
          </p>
        )}

        {error && (
          <p className="text-red-500 text-center text-sm py-12">
            {error}
          </p>
        )}

        {activeQuiz && (
          <section className="rounded-3xl border border-brand-border bg-brand-card p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between">
              <p className="text-brand text-sm">
                Pregunta {currentQuestionIndex + 1} de{" "}
                {quizzes.length}
              </p>
              <p className="text-nav text-sm">
                Puntos: {score}
              </p>
            </div>

            <h2 className="text-display mt-4 text-xl">
              {activeQuiz.question}
            </h2>

            <div className="mt-6 space-y-3">
              {activeQuiz.options.map((option) => {
                const isSelected =
                  selectedAnswer === option;
                const isCorrect =
                  option ===
                  activeQuiz.correct_answer;
                let style =
                  "border-brand-border bg-brand-bg hover:border-brand-cyan-light";
                if (answered && isCorrect)
                  style =
                    "border-green-500 bg-green-50";
                else if (
                  answered &&
                  isSelected &&
                  !isCorrect
                )
                  style = "border-red-500 bg-red-50";

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleAnswer(option)}
                    disabled={answered}
                    className={`w-full rounded-xl border p-4 text-left text-sm transition ${style}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {answered && (
              <button
                type="button"
                onClick={handleNext}
                className="mt-6 rounded-xl bg-brand-cyan px-6 py-3 text-sm text-white transition hover:bg-brand-cyan-hover"
              >
                {currentQuestionIndex + 1 >=
                quizzes.length
                  ? "Finalizar"
                  : "Siguiente"}
              </button>
            )}
          </section>
        )}

        {!activeQuiz && !loading && !error && (
          <>
            <p className="text-helper text-center text-sm">
              {quizzes.length === 0
                ? "No hay preguntas. Genera un cuestionario desde un documento."
                : `Tienes ${quizzes.length} preguntas disponibles.`}
            </p>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={startQuiz}
                disabled={quizzes.length === 0}
                className="rounded-xl bg-brand-cyan px-6 py-3 text-sm text-white transition hover:bg-brand-cyan-hover disabled:opacity-50"
              >
                Comenzar cuestionario
              </button>
            </div>
          </>
        )}

        {!activeQuiz && !loading && !error && (
          <QuizList quizzes={quizzes} />
        )}
      </div>

      <StartQuizModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGenerated={handleGenerate}
      />
    </WorkspaceShell>
  );
}
