import type { LoginResponse } from "../services/authService";

export default function UserAvatar({ user }: { user: LoginResponse | null }) {
  const initials = user
    ? `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase()
    : "?";

  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
      style={{
        background: "linear-gradient(135deg, #00d4aa33, #3b82f633)",
        color: "#00d4aa",
        border: "1px solid #1e3347",
      }}
      aria-label={user ? `${user.firstName} ${user.lastName}` : "Okänd användare"}
    >
      {initials}
    </div>
  );
}