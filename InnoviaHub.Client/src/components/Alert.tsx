type AlertProps = {
  message: string;
  type?: "success" | "error" | "confirm";
  onClose: () => void;
  onConfirm?: () => void;
};

export default function Alert({
  message,
  type = "error",
  onClose,
  onConfirm,
}: AlertProps) {
  const isConfirm = type === "confirm";

  if (isConfirm) {
    return (
      <div
        className="fixed inset-0 z-[2000] flex items-center justify-center px-6"
        style={{ background: "rgba(8, 14, 20, 0.7)" }}
      >
        <div
          role="alertdialog"
          aria-modal="true"
          className="w-full max-w-md rounded-xl p-6"
          style={{
            background: "#0d1824",
            border: "1px solid rgba(244, 63, 94, 0.45)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
            color: "#e2eaf2",
          }}
        >
          <div className="flex items-center gap-3">
            <span style={{ color: "#f43f5e" }}>!</span>
            <span className="text-sm">{message}</span>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm"
              style={{
                border: "1px solid #1e3347",
                color: "#7a94aa",
                cursor: "pointer ",
              }}
            >
              Avbryt
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="rounded-lg px-4 py-2 text-sm font-semibold"
              style={{
                background: "#f43f5e",
                color: "white",
                cursor: "pointer",
              }}
            >
              Ta bort
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      role="alert"
      className="flex w-full items-center gap-4 rounded-xl px-4 py-3"
      style={{
        background: "#0d1824",
        border: `1px solid ${type === "error" ? "rgba(244, 63, 94, 0.45)" : "rgba(0,212,170,0.45)"}`,
        color: "#e2eaf2",
      }}
    >
      <span style={{ color: type === "error" ? "#f43f5e" : "#00d4aa" }}>
        {type === "error" ? "!" : "✓"}
      </span>
      <span className="text-sm">{message}</span>

      <button
        type="button"
        onClick={onClose}
        className="text-lg"
        style={{ color: "#7a94aa", cursor: "pointer" }}
      >
        x
      </button>
    </div>
  );
}
