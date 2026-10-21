import { useEditor } from "./store";

export function FoldBar() {
  const fold = useEditor((s) => s.box.fold);
  const setBox = useEditor((s) => s.setBox);

  return (
    <div className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-xl border border-stone-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
      <span className="text-xs text-stone-500">À plat</span>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={fold}
        aria-label="Pliage"
        onChange={(e) => setBox({ fold: Number(e.target.value) })}
        className="flex-1 accent-kraft-700"
      />
      <span className="text-xs text-stone-500">Fermée</span>
    </div>
  );
}
