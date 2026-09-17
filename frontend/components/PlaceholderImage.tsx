const TONES: Record<string, string> = {
  olive: "from-[#3a3a2f] via-[#8a7654] to-[#d8c9a3]",
  emerald: "from-[#0f2e26] via-[#1f5a45] to-[#d4b26a]",
  geode: "from-[#1a1a1a] via-[#5a4a2f] to-[#c9a86a]",
  amber: "from-[#3d2b12] via-[#8a5a2a] to-[#e8c98a]",
  onyx: "from-[#141414] via-[#3a3a3a] to-[#8a8a8a]",
  walnut: "from-[#241a10] via-[#5a3c1e] to-[#b08d57]",
};

export default function PlaceholderImage({
  label,
  tone = "olive",
  className = "",
}: {
  label: string;
  tone?: keyof typeof TONES;
  className?: string;
}) {
  return (
    <div
      className={`relative flex items-end overflow-hidden bg-gradient-to-br ${TONES[tone] ?? TONES.olive} ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_60%)]" />
      <span className="label-caps relative m-4 text-surface/70">{label}</span>
    </div>
  );
}
