import { cn } from "@/lib/utils";

// Free is the brightest, Paid is the darkest. The word is always shown,
// so the tag never depends on colour alone.
const STYLES: Record<string, string> = {
  free: "bg-[#D0BCFC] text-[#250D30] border-[#D0BCFC]",
  freemium: "bg-[#7813A2] text-white border-[#980ED1]",
  paid: "bg-[#381149] text-[#A981FF] border-[#501669]",
};

const LABELS: Record<string, string> = {
  free: "Free",
  freemium: "Freemium",
  paid: "Paid",
};

export function PricingTag({
  pricing,
  className,
}: {
  pricing?: string;
  className?: string;
}) {
  const key = (pricing || "").trim().toLowerCase();
  // Unknown or missing pricing shows no tag instead of a guess.
  if (!STYLES[key]) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold leading-5",
        STYLES[key],
        className
      )}
    >
      {LABELS[key]}
    </span>
  );
}
