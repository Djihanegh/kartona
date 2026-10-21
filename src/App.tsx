import { useState } from "react";
import { Viewer } from "./features/viewer/Viewer";
import { Sidebar } from "./features/editor/Sidebar";
import { BoxScene } from "./features/editor/BoxScene";
import { FoldBar } from "./features/editor/FoldBar";
import { useEditorArtwork } from "./features/editor/useEditorArtwork";
import { ArDialog } from "./features/ar/ArDialog";
import { DielinePanel } from "./features/dieline/DielinePanel";
import { Brand } from "./components/ui/Brand";
type View = "3d" | "dieline";

const VIEWS: { id: View; label: string }[] = [
  { id: "3d", label: "Aperçu 3D" },
  { id: "dieline", label: "Patron à plat" },
];

export default function App() {
  const [view, setView] = useState<View>("3d");
  const [arOpen, setArOpen] = useState(false);
  const { box, canvases } = useEditorArtwork();

  return (
    <div className="flex h-full flex-col bg-stone-100 text-stone-900 md:flex-row">
      {/* Mobile : 55 % de la hauteur de l'écran. Ordinateur : tout l'espace restant */}
      <header className="flex h-12 shrink-0 items-center border-b border-stone-200 bg-white px-4 md:hidden">
        <Brand compact />
      </header>
      <main className="relative h-[55svh] shrink-0 bg-stone-200 md:h-full md:flex-1">
        <Viewer>
          <BoxScene canvases={canvases} />
        </Viewer>

        {view === "dieline" && <DielinePanel box={box} canvases={canvases} />}

        <div
          role="tablist"
          aria-label="Vue"
          className="absolute left-3 top-3 z-10 flex gap-1 rounded-lg bg-white/90 p-1 shadow-sm backdrop-blur md:left-4 md:top-4"
        >
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={view === v.id}
              onClick={() => setView(v.id)}
              className={`rounded-md px-2.5 py-1 text-xs transition sm:px-3 sm:py-1.5 sm:text-sm ${
                view === v.id
                  ? "bg-kraft-700 font-medium text-white"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        {view === "3d" && (
          <>
            <button
              type="button"
              onClick={() => setArOpen(true)}
              className="absolute right-3 top-3 rounded-lg bg-kraft-700 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-kraft-900 sm:px-4 sm:py-2 sm:text-sm md:right-4 md:top-4"
            >
              Voir en AR
            </button>
            <FoldBar />
          </>
        )}
      </main>

      <Sidebar />

      {arOpen && <ArDialog onClose={() => setArOpen(false)} />}
    </div>
  );
}
