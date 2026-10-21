export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "flex items-baseline gap-2" : ""}>
      <p
        className={`font-extrabold tracking-tight ${compact ? "text-lg" : "text-xl"}`}
      >
        K<span className="text-kraft-500">AR</span>TONA
      </p>
      <p className="text-xs text-stone-500">Aperçu avant impression</p>
    </div>
  );
}
