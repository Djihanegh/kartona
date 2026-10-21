const INKS = [
  { hex: "#1c2a6e", name: "Bleu" },
  { hex: "#1b1b1b", name: "Noir" },
  { hex: "#a3271f", name: "Rouge" },
  { hex: "#245a35", name: "Vert" },
  { hex: "#c9721a", name: "Orange" },
] as const;

interface InkPickerProps {
  label: string;
  value: string;
  onChange: (hex: string) => void;
}

export function InkPicker({ label, value, onChange }: InkPickerProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm text-stone-700">{label}</span>
      <div className="flex flex-wrap items-center gap-2">
        {INKS.map((ink) => {
          const active = value === ink.hex;
          return (
            <button
              key={ink.hex}
              type="button"
              title={ink.name}
              aria-label={ink.name}
              aria-pressed={active}
              onClick={() => onChange(ink.hex)}
              style={{ backgroundColor: ink.hex }}
              className={`size-7 rounded-full ring-offset-2 transition ${
                active
                  ? "ring-2 ring-stone-900"
                  : "ring-1 ring-stone-300 hover:ring-stone-500"
              }`}
            />
          );
        })}
        <label className="ml-1 flex cursor-pointer items-center gap-2 text-xs text-stone-500">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="size-7 cursor-pointer rounded border-0 bg-transparent p-0"
          />
          Autre
        </label>
      </div>
    </div>
  );
}
