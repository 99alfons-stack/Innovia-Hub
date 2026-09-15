import { useState, type FormEvent } from "react";
import { changePassword } from "../../services/authService";

type ChangePasswordModalProps = {
  onChanged: () => void;
  onLogout: () => void;
};

export default function ChangePasswordModal({ onChanged, onLogout }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (newPassword.length < 6 || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/\d/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword)) {
      setError("Det nya lösenordet måste vara minst 6 tecken och innehålla stor bokstav, liten bokstav, siffra och specialtecken.");
      return;
    }

    if (newPassword !== confirmation) {
      setError("Lösenorden matchar inte.");
      return;
    }

    setIsLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      onChanged();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Lösenordet kunde inte ändras.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
      <section className="w-full max-w-md rounded-xl p-8" style={{ background: "#0d1824", border: "1px solid #1e3347", boxShadow: "0 16px 50px rgba(0,0,0,0.5)" }}>
        <p className="mono mb-3 text-xs uppercase" style={{ color: "#00d4aa" }}>Första inloggningen</p>
        <h1 className="text-2xl font-bold" style={{ color: "#e2eaf2", fontFamily: "Outfit, sans-serif" }}>Byt lösenord</h1>
        <p className="mt-2 text-sm" style={{ color: "#7a94aa" }}>Du måste välja ett personligt lösenord innan du kan fortsätta.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input aria-label="Nuvarande lösenord" type="password" placeholder="Nuvarande lösenord" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={{ background: "#111e2d", border: "1px solid #1e3347", color: "#e2eaf2" }} />
          <input aria-label="Nytt lösenord" type="password" placeholder="Nytt personligt lösenord" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={{ background: "#111e2d", border: "1px solid #1e3347", color: "#e2eaf2" }} />
          <input aria-label="Bekräfta nytt lösenord" type="password" placeholder="Bekräfta nytt lösenord" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={{ background: "#111e2d", border: "1px solid #1e3347", color: "#e2eaf2" }} />
          {error && <p className="text-sm" style={{ color: "#ff6b6b" }}>{error}</p>}
          <button type="submit" disabled={isLoading} className="w-full rounded-lg py-3 text-sm font-semibold" style={{ background: "#00d4aa", color: "#080e14", fontFamily: "Outfit, sans-serif" }}>{isLoading ? "Byter lösenord..." : "Spara nytt lösenord"}</button>
          <button type="button" onClick={onLogout} className="w-full py-2 text-sm" style={{ color: "#7a94aa" }}>Logga ut</button>
        </form>
      </section>
    </div>
  );
}