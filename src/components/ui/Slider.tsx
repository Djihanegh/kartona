import { useId } from "react";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: SliderProps) {
  const id = useId();
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5">
      <label htmlFor={id} className="text-sm text-stone-700">
        {label}
      </label>
      <span className="font-mono text-sm tabular-nums text-stone-900">
        {value}
        {unit && <span className="ml-0.5 text-stone-400">{unit}</span>}
      </span>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="col-span-2 w-full accent-kraft-700"
      />
    </div>
  );
}
