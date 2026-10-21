import { useEffect, useRef, useState } from "react";
import { useEditor } from "./store";

const DURATION = 2200; // ms pour un pliage complet

export function FoldBar() {
  const fold = useEditor((s) => s.fold);
  const setFold = useEditor((s) => s.setFold);
  const frame = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);

  const stop = () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    setPlaying(false);
  };

  // Arrête l'animation si le composant disparaît
  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [],
  );

  const play = () => {
    stop();
    const from = useEditor.getState().fold; // valeur actuelle, sans attendre un rendu
    const to = from > 0.5 ? 0 : 1;

    // Respecte le réglage « réduire les animations » du système
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFold(to);
      return;
    }

    const duration = DURATION * Math.abs(to - from);
    const start = performance.now();
    setPlaying(true);

    const step = (now: number) => {
      const k = Math.min(1, (now - start) / duration);
      setFold(from + (to - from) * k);
      if (k < 1) {
        frame.current = requestAnimationFrame(step);
      } else {
        frame.current = null;
        setPlaying(false);
      }
    };
    frame.current = requestAnimationFrame(step);
  };

  return (
    <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 rounded-xl border border-stone-200 bg-white/90 px-3 py-2 shadow-sm backdrop-blur md:inset-x-4 md:bottom-4 md:gap-3 md:px-4 md:py-3">
      <button
        type="button"
        onClick={playing ? stop : play}
        className="w-24 shrink-0 rounded-lg bg-kraft-700 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-kraft-900"
      >
        {playing ? "Pause" : fold > 0.5 ? "Déplier" : "Plier"}
      </button>
      <span className="hidden text-xs text-stone-500 sm:inline">À plat</span>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={fold}
        aria-label="Pliage"
        onChange={(e) => {
          stop(); // la main reprend le contrôle
          setFold(Number(e.target.value));
        }}
        className="flex-1 accent-kraft-700"
      />
      <span className="hidden text-xs text-stone-500 sm:inline">Fermée</span>
    </div>
  );
}
