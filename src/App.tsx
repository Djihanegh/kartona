import { useState } from "react";
import { Viewer } from "./features/viewer/Viewer";
import { Sidebar } from "./features/editor/Sidebar";
import { BoxScene } from "./features/editor/BoxScene";
import { FoldBar } from "./features/editor/FoldBar";
import { useEditorArtwork } from "./features/editor/useEditorArtwork";
import { ArDialog } from "./features/ar/ArDialog";
import { DielinePanel } from "./features/dieline/DielinePanel";

type View = "3d" | "dieline";

const VIEWS: { id: View; label: string }[] = [
  { id: "3d", label: "Aperçu 3D" },
  { id: "dieline", label: "Patron à plat" },
];

export default function App() {
  const [view, setView] = useState<View>("3d");
  const [arOpen, setArOpen] = useState(false);
  const { box, canvases } = useEditorArtwork(); // dessinés une seule fois

  return (
    <div className="flex h-full bg-stone-100 text-stone-900">
      <Sidebar />

      <main className="relative flex-1 bg-stone-200">
        <Viewer>
          <BoxScene canvases={canvases} />
        </Viewer>

        {view === "dieline" && <DielinePanel box={box} canvases={canvases} />}

        <div
          role="tablist"
          aria-label="Vue"
          className="absolute left-4 top-4 z-10 flex gap-1 rounded-lg bg-white/90 p-1 shadow-sm backdrop-blur"
        >
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={view === v.id}
              onClick={() => setView(v.id)}
              className={`rounded-md px-3 py-1.5 text-sm transition ${
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
              className="absolute right-4 top-4 rounded-lg bg-kraft-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-kraft-900"
            >
              Voir en AR
            </button>
            <FoldBar />
          </>
        )}
      </main>

      {arOpen && <ArDialog onClose={() => setArOpen(false)} />}
    </div>
  );
}
