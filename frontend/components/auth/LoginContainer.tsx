import LoginLeftPanel from "./LoginLeftPanel";
import LoginForm from "./LoginForm";

export default function LoginContainer() {
  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-slate-950">

      <LoginLeftPanel />

      <LoginForm />

    </main>
  );
}