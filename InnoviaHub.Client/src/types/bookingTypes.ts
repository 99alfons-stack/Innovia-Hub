import type {ResourceType} from "../../services/resourceService.ts";

export type Step = "select" | "configure" | "overview" | "confirmation";

export interface Resource {
  id: string;
  type: ResourceType;
  label: string;
  sub: string;
  status: "available" | "booked" | "reserved";
  features: string[];
  color: string;
  icon: string;
}