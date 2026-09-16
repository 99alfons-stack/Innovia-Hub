import type { Step } from "../../types/bookingTypes.ts";

type StepProps = {
  step: Step;
};

const steps: Step[] = ["select", "configure", "overview", "confirmation"];
const labels: Record<Step, string> = {
  select: "Resurs",
  configure: "Konfigurera",
  overview: "Översikt",
  confirmation: "Klart",
};

export default function BookingStepIndicator({ step }: StepProps) {
  const stepIndex = steps.indexOf(step);

  return (
    <div className="flex items-center gap-3 mb-8">
      {steps.map((s, i) => {
        const isActive = s === step;
        const isDone = i < stepIndex;

        return (
          <div key={s} className="flex items-center gap-2">
            <div
              className="flex items-center gap-2"
              style={{ opacity: isDone || isActive ? 1 : 0.4 }}
            >
              <div
                className="rounded-full flex items-center justify-center text-xs font-bold mono"
                style={{
                  width: 24,
                  height: 24,
                  background:
                    isDone || isActive ? "#00d4aa" : "#1e3347",
                  color:
                    isDone || isActive ? "#080e14" : "#7a94aa",
                }}
              >
                {isDone ? "✓" : i + 1}
              </div>

              <span
                className="hidden sm:block text-sm"
                style={{
                  color: isActive ? "#e2eaf2" : "#7a94aa",
                  fontFamily: "Outfit, sans-serif",
                }}
              >
                {labels[s]}
              </span>
            </div>

            {i < steps.length - 1 && (
              <div
                className="w-8 h-px"
                style={{
                  background: i < stepIndex ? "#00d4aa" : "#1e3347",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}