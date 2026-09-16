export type AdminTab = "dashboard" | "sensors" | "resources" | "members";

export type Sensor = {
  id: string;
  name: string;
  value: string;
  status: string;
  location: string;
  icon: string;
  trend: string;
};

export const sensors: Sensor[] = [
  {
    id: "s1",
    name: "Temperatur – Mötesrum A",
    value: "22.4°C",
    status: "ok",
    location: "Rum A",
    icon: "🌡",
    trend: "+0.3°",
  },
  {
    id: "s2",
    name: "Luftkvalitet – Mötesrum B",
    value: "CO₂ 412 ppm",
    status: "ok",
    location: "Rum B",
    icon: "💨",
    trend: "Stabilt",
  },
  {
    id: "s3",
    name: "Rörelse – Coworking zon A",
    value: "Aktiv",
    status: "ok",
    location: "Zon A",
    icon: "👁",
    trend: "9 pers.",
  },
  {
    id: "s4",
    name: "Elförbrukning – AI-server",
    value: "3.8 kWh",
    status: "warn",
    location: "Serverhall",
    icon: "⚡",
    trend: "↑ 12%",
  },
];

export const adminTabs: { id: AdminTab; label: string; icon: string }[] = [
  { id: "dashboard", label: "Översikt", icon: "◈" },
  { id: "sensors", label: "Sensorer", icon: "⚙" },
  { id: "resources", label: "Resurser", icon: "▪" },
  { id: "members", label: "Medlemmar", icon: "◯" },
];
