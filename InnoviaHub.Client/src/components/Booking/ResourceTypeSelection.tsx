import type { ResourceType } from '../../../services/resourceService';

type ResourceTypeSelectionProps = {
  resourceTypes: ResourceType[];
  onSelectResourceType: (resourceTypeId: string) => void;
};

export default function ResourceTypeSelection({
  resourceTypes,
  onSelectResourceType,
}: ResourceTypeSelectionProps) {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1
          className="text-3xl font-bold mb-2"
          style={{
            color: "#e2eaf2",
            fontFamily: "Outfit, sans-serif",
          }}
        >
          Vad vill du boka?
        </h1>

        <p
          className="text-sm"
          style={{ color: "#7a94aa" }}
        >
          Välj en resurstyp för att se tillgängliga tider och resurser.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {resourceTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelectResourceType(type.id)}
            className="rounded-2xl p-7 text-left transition-all duration-200 min-h-45 flex flex-col justify-between"
            style={{
              background: "#0d1824",
              border: "1px solid #1e3347",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#00d4aa";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#1e3347";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{
                  background: "rgba(0,212,170,0.10)",
                  color: "#00d4aa",
                  fontSize: "20px",
                }}
              >
                ◈
              </div>

              <h3
                className="text-xl font-semibold mb-2"
                style={{
                  color: "#e2eaf2",
                  fontFamily: "Outfit, sans-serif",
                }}
              >
                {type.name}
              </h3>

              <p
                className="text-sm leading-6"
                style={{ color: "#7a94aa" }}
              >
                {type.description || "Visa tillgängliga resurser"}
              </p>
            </div>

            <div
              className="mt-6 text-sm font-medium"
              style={{ color: "#00d4aa" }}
            >
              Välj →
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}