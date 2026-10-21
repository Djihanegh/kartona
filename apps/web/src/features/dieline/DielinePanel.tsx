import { useMemo, useRef, useState } from "react";
import type { BoxParams } from "../box/types";
import { computeDieline } from "../box/dieline";
import type { FaceCanvases } from "../print/useFaceCanvases";
import { DielineSvg } from "./DielineSvg";
import { TechSheet } from "./TechSheet";

export function DielinePanel({
  box,
  canvases,
}: {
  box: BoxParams;
  canvases: FaceCanvases;
}) {
  const [showArtwork, setShowArtwork] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);
  const dieline = useMemo(() => computeDieline(box), [box]);

  const download = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const xml =
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      new XMLSerializer().serializeToString(svg);
    const url = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `kartona-patron-${box.length}x${box.width}x${box.height}${showArtwork ? "" : "-decoupe"}.svg`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="absolute inset-0 flex flex-col gap-3 overflow-y-auto bg-stone-100 p-3 pt-14 md:flex-row md:gap-4 md:overflow-hidden md:p-4 md:pt-16">
      <section className="flex min-h-[70%] min-w-0 flex-col gap-3 rounded-xl border border-stone-200 bg-white p-4 md:min-h-0 md:flex-1">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs text-stone-500">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-5 bg-[#d1301b]" /> Découpe
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-5 border-t-2 border-dashed border-[#1f43c0]" />{" "}
              Pliage
            </span>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-700">
              <input
                type="checkbox"
                checked={showArtwork}
                onChange={(e) => setShowArtwork(e.target.checked)}
                className="accent-kraft-700"
              />
              Afficher le visuel
            </label>
            <button
              type="button"
              onClick={download}
              className="rounded-lg bg-kraft-700 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-kraft-900"
            >
              Exporter en SVG
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 rounded-lg bg-stone-50">
          <DielineSvg
            ref={svgRef}
            dieline={dieline}
            canvases={canvases}
            showArtwork={showArtwork}
          />
        </div>

        <p className="text-xs text-stone-400">
          Modèle simplifié : sans rabats anti-poussière ni languette de collage.
          Vérifiez le patron avec votre fabricant de formes de découpe.
        </p>
      </section>

      <aside className="flex w-full flex-col gap-4 rounded-xl border border-stone-200 bg-white p-5 md:w-80 md:shrink-0">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-500">
          Fiche technique
        </h2>
        <TechSheet box={box} dieline={dieline} />
      </aside>
    </div>
  );
}
