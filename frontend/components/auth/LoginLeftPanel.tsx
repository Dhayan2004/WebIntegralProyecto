export default function LoginLeftPanel() {
  return (
    <section className="hidden lg:flex relative flex-col justify-between overflow-hidden bg-gradient-to-br from-cyan-700 via-slate-900 to-slate-950 p-14">

      <div>
        <h1 className="text-4xl font-black text-white">
          StudyBuddy AI
        </h1>

        <p className="mt-3 text-slate-300 max-w-md">
          Tu plataforma inteligente para estudiar con resúmenes,
          cuestionarios, flashcards e inteligencia artificial.
        </p>
      </div>

      <div className="flex justify-center">
        <img
          src="/images/login-illustration.svg"
          alt="Study"
          className="w-[420px]"
        />
      </div>

      <div className="text-slate-400 text-sm">
        Aprende más rápido.
        Estudia mejor.
      </div>

    </section>
  );
}