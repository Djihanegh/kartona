interface Option<T extends string> {
  value: T;
  label: string;
}

interface SegmentedProps<T extends string> {
  label: string;
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: SegmentedProps<T>) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm text-stone-700">{label}</span>
      <div
        role="radiogroup"
        aria-label={label}
        className="grid auto-cols-fr grid-flow-col gap-1 rounded-lg bg-stone-100 p-1"
      >
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(o.value)}
              className={`rounded-md px-3 py-1.5 text-sm transition ${
                active
                  ? "bg-white font-medium text-stone-900 shadow-sm"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
