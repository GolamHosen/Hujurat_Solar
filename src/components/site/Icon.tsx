import {
  Sun,
  Battery,
  Wrench,
  TrendingUp,
  Building2,
  Home,
  ShieldCheck,
  Hammer,
  Activity,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  sun: Sun,
  battery: Battery,
  wrench: Wrench,
  "trending-up": TrendingUp,
  "building-2": Building2,
  home: Home,
  "shield-check": ShieldCheck,
  hammer: Hammer,
  activity: Activity,
};

export default function Icon({ name, className }: { name: string; className?: string }) {
  const Component = ICON_MAP[name] || Sun;
  return <Component className={className} aria-hidden="true" />;
}
