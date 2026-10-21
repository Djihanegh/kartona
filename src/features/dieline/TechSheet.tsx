import type { BoxParams } from "../box/types";
import type { Dieline } from "../box/dieline";
import { thickness } from "../box/geometry";
import { PROCESSES } from "../print/processes";
import { useEditor } from "../editor/store";

const mm = (n: number) =>
  n.toLocaleString("fr-FR", { maximumFractionDigits: 1 });
const m2 = (mm2: number) =>
  (mm2 / 1e6).toLocaleString("fr-FR", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });

export function TechSheet({
  box,
  dieline: d,
}: {
  box: BoxParams;
  dieline: Dieline;
}) {
  const design = useEditor((s) => s.design);
  const t = thickness(box);
  const info = PROCESSES[design.process];

  const rows: [string, string][] = [
    [
      "Dimensions intérieures",
      `${box.length} × ${box.width} × ${box.height} mm`,
    ],
    [
      "Dimensions extérieures (approx.)",
      `${mm(box.length + 2 * t)} × ${mm(box.width + 2 * t)} × ${mm(box.height + 2 * t)} mm`,
    ],
    ["Format du flan", `${mm(d.bounds.w)} × ${mm(d.bounds.h)} mm`],
    ["Carton par boîte", `${m2(d.bounds.w * d.bounds.h)} m²`],
    ["Surface utile", `${m2(d.panelArea)} m²`],
    ["Cannelure", box.flute === "E" ? "E · 1,5 mm" : "B · 3 mm"],
    ["Couche extérieure", design.substrate === "kraft" ? "Kraft" : "Blanche"],
    ["Procédé", info.label],
    [
      "Encres",
      info.fullColor
        ? `CMJN + ${design.inks.length} Pantone`
        : `${design.inks.length} couleur(s)`,
    ],
  ];

  return (
    <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2.5 text-sm">
      {rows.map(([label, value]) => (
        <div key={label} className="contents">
          <dt className="text-stone-500">{label}</dt>
          <dd className="text-right font-mono tabular-nums text-stone-900">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
