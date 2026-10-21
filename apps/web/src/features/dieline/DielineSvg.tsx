import { useMemo, type Ref } from "react";
import type { Dieline } from "../box/dieline";
import type { FaceId } from "../box/types";
import type { FaceCanvases } from "../print/useFaceCanvases";

interface DielineSvgProps {
  dieline: Dieline;
  canvases: FaceCanvases;
  showArtwork: boolean;
  ref?: Ref<SVGSVGElement>;
}

const CUT = "#d1301b";
const FOLD = "#1f43c0";

export function DielineSvg({
  dieline: d,
  canvases,
  showArtwork,
  ref,
}: DielineSvgProps) {
  // Les visuels des faces, convertis une fois en images intégrables au SVG
  const images = useMemo(() => {
    const out = {} as Record<FaceId, string>;
    for (const id of Object.keys(canvases) as FaceId[])
      out[id] = canvases[id].toDataURL("image/jpeg", 0.85);
    return out;
  }, [canvases]);

  const size = Math.max(d.bounds.w, d.bounds.h);
  const pad = size * 0.1;
  const vb = {
    x: d.bounds.x - pad,
    y: d.bounds.y - pad,
    w: d.bounds.w + 2 * pad,
    h: d.bounds.h + 2 * pad,
  };
  const stroke = size * 0.0018;
  const fs = size * 0.022;

  const { bottom, front, left, right } = d.panels;

  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
      width={`${vb.w}mm`} // à l'échelle réelle une fois exporté
      height={`${vb.h}mm`}
      className="h-full w-full"
      role="img"
      aria-label="Patron à plat avec traits de découpe et de pliage"
    >
      {showArtwork &&
        (Object.keys(d.panels) as FaceId[]).map((id) => {
          const r = d.panels[id];
          return (
            <image
              key={id}
              href={images[id]}
              x={r.x}
              y={r.y}
              width={r.w}
              height={r.h}
              preserveAspectRatio="none"
            />
          );
        })}

      <polygon
        points={d.cut.map(([x, y]) => `${x},${y}`).join(" ")}
        fill="none"
        stroke={CUT}
        strokeWidth={stroke}
        strokeLinejoin="round"
      />

      {d.folds.map((l, i) => (
        <line
          key={i}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke={FOLD}
          strokeWidth={stroke}
          strokeDasharray={`${stroke * 5} ${stroke * 3}`}
        />
      ))}

      {/* Cotes */}
      <g
        fill="#57534e"
        fontSize={fs}
        fontFamily="ui-monospace, Menlo, monospace"
      >
        <text x={0} y={front.y - fs * 0.6} textAnchor="middle">
          L {bottom.w}
        </text>
        <text x={right.x + right.w + fs * 0.5} y={0} dominantBaseline="middle">
          l {bottom.h}
        </text>
        <text x={left.x + left.w / 2} y={left.y - fs * 0.6} textAnchor="middle">
          H {front.h}
        </text>
      </g>
    </svg>
  );
}
