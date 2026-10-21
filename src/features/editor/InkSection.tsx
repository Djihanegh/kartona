import { useEditor } from "./store";
import { PROCESSES, spotLimit } from "../print/processes";
import type { PrintElement } from "../box/types";

const ELEMENTS: { id: PrintElement; label: string }[] = [
  { id: "logo", label: "Logo" },
  { id: "brand", label: "Nom de la marque" },
  { id: "marks", label: "Pictogrammes et mentions" },
];

export function InkSection() {
  const design = useEditor((s) => s.design);
  const addInk = useEditor((s) => s.addInk);
  const updateInk = useEditor((s) => s.updateInk);
  const removeInk = useEditor((s) => s.removeInk);
  const assignInk = useEditor((s) => s.assignInk);

  const info = PROCESSES[design.process];
  const limit = spotLimit(design.process);
  // En offset, le logo est en quadri : on ne lui attribue pas d'encre
  const elements = info.fullColor
    ? ELEMENTS.filter((e) => e.id !== "logo")
    : ELEMENTS;

  return (
    <>
      {/* La palette */}
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-stone-700">
            {info.fullColor ? "Tons directs (Pantone)" : "Encres"}
          </span>
          <span className="font-mono text-xs tabular-nums text-stone-500">
            {design.inks.length} / {limit}
          </span>
        </div>

        <ul className="flex flex-col gap-1.5">
          {design.inks.map((hex, i) => (
            <li key={i} className="flex items-center gap-2">
              <input
                type="color"
                value={hex}
                aria-label={`Couleur de l'encre ${i + 1}`}
                onChange={(e) => updateInk(i, e.target.value)}
                className="size-8 cursor-pointer rounded-md border border-stone-300 bg-transparent p-0.5"
              />
              <span className="text-xs text-stone-500">Encre {i + 1}</span>
              <span className="font-mono text-xs uppercase text-stone-700">
                {hex}
              </span>
              {design.inks.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeInk(i)}
                  className="ml-auto text-xs text-stone-400 hover:text-red-600"
                >
                  Retirer
                </button>
              )}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={addInk}
          disabled={design.inks.length >= limit}
          className="self-start text-sm font-medium text-kraft-700 hover:underline disabled:cursor-not-allowed disabled:text-stone-400 disabled:no-underline"
        >
          + Ajouter une encre
        </button>

        {info.fullColor && (
          <p className="text-xs leading-relaxed text-stone-500">
            Le logo est imprimé en quadri (CMJN), qui occupe 4 des{" "}
            {info.maxColors} groupes de la machine.
          </p>
        )}
      </div>

      {/* L'attribution */}
      <div className="flex flex-col gap-2.5">
        <span className="text-sm text-stone-700">Attribution des encres</span>
        {elements.map((el) => (
          <div key={el.id} className="flex items-center justify-between gap-3">
            <span className="text-xs text-stone-600">{el.label}</span>
            <div
              role="radiogroup"
              aria-label={`Encre : ${el.label}`}
              className="flex gap-1.5"
            >
              {design.inks.map((hex, i) => {
                const active = design.assign[el.id] === i;
                return (
                  <button
                    key={i}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    aria-label={`Encre ${i + 1}`}
                    onClick={() => assignInk(el.id, i)}
                    style={{ backgroundColor: hex }}
                    className={`size-6 rounded-full ring-offset-2 transition ${
                      active
                        ? "ring-2 ring-stone-900"
                        : "ring-1 ring-stone-300 hover:ring-stone-500"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
