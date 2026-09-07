import { useEffect, useState } from "react";
import Alert from "./Alert";
import AdminStatusBadge from "./AdminStatusBadge";
import {
  createUser,
  deleteUser,
  getAllUsers,
  type UserSummary,
} from "../../services/userService";

type MemberForm = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  isAdmin: boolean;
};
const emptyForm: MemberForm = {
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  isAdmin: false,
};
const fieldStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  background: "#111e2d",
  border: "1px solid #1e3347",
  borderRadius: 10,
  padding: "10px 12px",
  color: "#e2eaf2",
  fontSize: 14,
};

function MemberModal({
  form,
  alert,
  onChange,
  onSubmit,
  onClose,
  onClearAlert,
}: {
  form: MemberForm;
  alert: string;
  onChange: (form: MemberForm) => void;
  onSubmit: (event: React.FormEvent) => void;
  onClose: () => void;
  onClearAlert: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(8,14,20,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#0d1824",
          border: "1px solid #1e3347",
          borderRadius: 16,
          padding: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "#e2eaf2",
              fontFamily: "Outfit, sans-serif",
              fontSize: 18,
            }}
          >
            Lägg till medlem
          </h2>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#7a94aa",
              fontSize: 24,
            }}
          >
            ×
          </button>
        </div>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 16 }}>
          <label style={{ color: "#7a94aa", fontSize: 14 }}>
            Förnamn
            <input
              required
              value={form.firstname}
              onChange={(event) =>
                onChange({ ...form, firstname: event.target.value })
              }
              style={{ ...fieldStyle, display: "block", marginTop: 8 }}
              placeholder="T.ex. Anna"
            />
          </label>
          <label style={{ color: "#7a94aa", fontSize: 14 }}>
            Efternamn
            <input
              required
              value={form.lastname}
              onChange={(event) =>
                onChange({ ...form, lastname: event.target.value })
              }
              style={{ ...fieldStyle, display: "block", marginTop: 8 }}
              placeholder="T.ex. Svensson"
            />
          </label>
          <label style={{ color: "#7a94aa", fontSize: 14 }}>
            E-post
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) =>
                onChange({ ...form, email: event.target.value })
              }
              style={{ ...fieldStyle, display: "block", marginTop: 8 }}
              placeholder="anna@exempel.se"
            />
          </label>
          <label style={{ color: "#7a94aa", fontSize: 14 }}>
            Lösenord (minst 6 tecken, stor/liten bokstav, siffra och specialtecken)
            <input
              required
              type="password"
              value={form.password}
              onChange={(event) =>
                onChange({ ...form, password: event.target.value })
              }
              style={{ ...fieldStyle, display: "block", marginTop: 8 }}
              placeholder="Ange ett lösenord"
            />
          </label>
          {alert && (
            <Alert message={alert} type="error" onClose={onClearAlert} />
          )}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "transparent",
                border: "1px solid #1e3347",
                color: "#7a94aa",
                borderRadius: 10,
                padding: "10px 14px",
              }}
            >
              Avbryt
            </button>
            <button
              type="submit"
              style={{
                background: "#00d4aa",
                border: "none",
                color: "#080e14",
                borderRadius: 10,
                padding: "10px 16px",
                fontWeight: 700,
              }}
            >
              Spara medlem
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MembersAdmin() {
  const [members, setMembers] = useState<UserSummary[]>([]);
  const [form, setForm] = useState<MemberForm>(emptyForm);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<UserSummary | null>(null);
  const [alert, setAlert] = useState("");

  useEffect(() => {
    getAllUsers()
      .then(setMembers)
      .catch(() => setAlert("Kunde inte hämta användare"));
  }, []);

  const closeForm = () => {
    setFormOpen(false);
    setForm(emptyForm);
    setAlert("");
  };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    const hasValidPassword =
      form.password.length >= 6 &&
      /[A-Z]/.test(form.password) &&
      /[a-z]/.test(form.password) &&
      /\d/.test(form.password) &&
      /[^A-Za-z0-9]/.test(form.password);

    if (!hasValidPassword) {
      setAlert("Lösenordet måste ha minst 6 tecken, en stor bokstav, en liten bokstav, en siffra och ett specialtecken.");
      return;
    }

    try {
      const member = await createUser({
        firstName: form.firstname.trim(),
        lastName: form.lastname.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      setMembers((current) => [member, ...current]);
      closeForm();
    } catch (error) {
      setAlert(error instanceof Error ? error.message : "Kunde inte skapa medlem");
    }
  };
  const remove = async () => {
    if (!deleting) return;
    try {
      await deleteUser(deleting.id);
      setMembers((current) =>
        current.filter((member) => member.id !== deleting.id),
      );
    } catch {
      setAlert("Kunde inte ta bort medlem");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: "Outfit, sans-serif", color: "#e2eaf2" }}
        >
          Medlemmar
        </h1>
        <button
          onClick={() => {
            setAlert("");
            setForm(emptyForm);
            setFormOpen(true);
          }}
          className="px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ background: "#00d4aa", color: "#080e14" }}
        >
          + Ny medlem
        </button>
      </div>
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid #1e3347" }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ background: "#111e2d" }}>
              {["Förnamn", "Efternamn", "Admin", "Status", "Åtgärd"].map(
                (heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3 text-left text-xs"
                    style={{ color: "#7a94aa" }}
                  >
                    {heading}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr
                key={member.id}
                style={{
                  borderBottom: "1px solid #1e3347",
                  background: index % 2 ? "#0a1520" : "transparent",
                }}
              >
                <td className="px-4 py-3 text-sm" style={{ color: "#e2eaf2" }}>
                  {member.firstname}
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: "#e2eaf2" }}>
                  {member.lastname}
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: "#7a94aa" }}>
                  {member.isAdmin ? "Ja" : "Nej"}
                </td>
                <td className="px-4 py-3">
                  <AdminStatusBadge status="active" />
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setDeleting(member)}
                    className="text-xs px-3 py-2 rounded-lg"
                    style={{
                      background: "rgba(244,63,94,0.1)",
                      color: "#f43f5e",
                      border: "1px solid rgba(244,63,94,0.25)",
                    }}
                  >
                    Ta bort
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {formOpen && (
        <MemberModal
          form={form}
          alert={alert}
          onChange={setForm}
          onSubmit={submit}
          onClose={closeForm}
          onClearAlert={() => setAlert("")}
        />
      )}
      {deleting && (
        <Alert
          message={`Vill du ta bort ${deleting.firstname} ${deleting.lastname}?`}
          type="confirm"
          onClose={() => setDeleting(null)}
          onConfirm={remove}
        />
      )}
    </div>
  );
}
