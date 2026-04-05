import {
  Shield,
  CheckCircle,
  Sparkles,
  Droplet,
  Flame,
  Cog,
  Zap,
  Leaf,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ProductFeature } from "@/lib/productStaticData";

const iconMap: Record<ProductFeature["icon"], LucideIcon> = {
  shield: Shield,
  check: CheckCircle,
  sparkles: Sparkles,
  droplet: Droplet,
  flame: Flame,
  cog: Cog,
  zap: Zap,
  leaf: Leaf,
};

export function ProductFeatures({
  features,
}: {
  features: ProductFeature[];
}) {
  if (features.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {features.map((f) => {
        const Icon = iconMap[f.icon];
        return (
          <div
            key={f.title}
            className={`rounded-xl border bg-gradient-to-br p-6 shadow-md transition-shadow hover:shadow-lg ${f.bgGradient} ${f.borderColor}`}
          >
            <div className="mb-4 flex items-center gap-3">
              <Icon className={`h-6 w-6 ${f.iconColor}`} />
              <h3 className="text-lg font-semibold text-gray-900">
                {f.title}
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-700">{f.desc}</p>
          </div>
        );
      })}
    </div>
  );
}
