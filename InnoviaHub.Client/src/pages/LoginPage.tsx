import { useState, type FormEvent } from "react";
import { login, type LoginResponse } from "../services/authService";

type LoginPageProps = {
  onLogin: (user: LoginResponse) => void;
};

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const user = await login({ email, password });
      onLogin(user);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Inloggningen misslyckades"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    
    <div className="min-h-screen grid-bg" style={{ background: "#080e14" }}>
      {/*========================================== HEADER START ==================================================*/}
      <header
        className="flex items-center justify-between px-6 py-4"
        style={{
          background: "rgba(8,14,20,0.9)",
          borderBottom: "1px solid #1e3347",
        }}
      >
        {/*========================================== LOGOTYP START ==================================================*/}
        <div className="flex items-center gap-3">
          <div
            className="rounded-lg flex items-center justify-center"
            style={{
              width: 36,
              height: 36,
              background: "linear-gradient(135deg, #00d4aa, #0070f3)",
            }}
          >
            <span style={{ fontSize: 18 }}>◈</span>
          </div>

          <span
            className="text-xl font-bold"
            style={{ fontFamily: "Outfit, sans-serif", color: "#e2eaf2" }}
          >
            Innovia<span style={{ color: "#00d4aa" }}>Hub</span>
          </span>
        </div>
        {/*========================================== LOGOTYP END ==================================================*/}

        {/*<button
          onClick={onBack}
          className="text-sm"
          style={{ color: "#7a94aa" }}
        >
          ← Tillbaka
        </button>
        */}
      </header>
      {/*========================================== HEADER END ==================================================*/}

      {/*========================================== LOGIN-INNEHÅLL START ==================================================*/}
      <main className="flex min-h-[calc(100vh-77px)] items-center justify-center px-6">
        {/*========================================== LOGIN PANEL START ==================================================*/}
        <section
          className="w-full max-w-md rounded-xl p-8"
          style={{
            background: "#0d1824",
            border: "1px solid #1e3347",
            boxShadow: "0 16px 50px rgba(0,0,0,0.35)",
          }}
        >
          {/*========================================== LOGIN RUBRIK START ==================================================*/}
          <div className="mb-8">
            <p
              className="mono mb-3 text-xs uppercase"
              style={{ color: "#00d4aa" }}
            >
              InnoviaHub
            </p>

            <h1
              className="text-3xl font-bold"
              style={{
                fontFamily: "Outfit, sans-serif",
                color: "#e2eaf2",
              }}
            >
              Logga in
            </h1>
            <p className="mt-2 text-sm" style={{ color: "#7a94aa" }}>  </p>
          </div>
          {/*========================================== LOGIN RUBRIK END ==================================================*/}

          {/*========================================== LOGIN FORMULÄR START ==================================================*/}
          <form className="space-y-5"  onSubmit={handleSubmit}>
           
            <div>
              <label
                className="mb-2 block text-sm font-medium"
                style={{
                  color: "#e2eaf2",
                  fontFamily: "Outfit, sans-serif",
                }}
              >
                E-post
              </label>

              <input
                type="email"
                placeholder="namn@exempel.se"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                style={{
                  background: "#111e2d",
                  border: "1px solid #1e3347",
                  color: "#e2eaf2",
                }}
              />
            </div>
          
            <div>
              <label
                className="mb-2 block text-sm font-medium"
                style={{
                  color: "#e2eaf2",
                  fontFamily: "Outfit, sans-serif",
                }}
              >
                Lösenord
              </label>

              <input
                type="password"
                placeholder="Ditt lösenord"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                style={{
                  background: "#111e2d",
                  border: "1px solid #1e3347",
                  color: "#e2eaf2",
                }}
              />
            </div>

            {error && (
              <p className="text-sm" style={{ color: "#ff6b6b" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg py-3 text-sm font-semibold transition-all"
              style={{
                background: "#00d4aa",
                color: "#080e14",
                fontFamily: "Outfit, sans-serif",
              }}
            >
              {isLoading ? "Loggar in..." : "Logga in"}
            </button>
          </form>
          {/*========================================== LOGIN-FORMULÄR END ==================================================*/}
        </section>
        {/*========================================== LOGIN-PANEL END ==================================================*/}
      </main>
      {/*========================================== LOGIN-INNEHÅLL END ==================================================*/}
    </div>
  );
}