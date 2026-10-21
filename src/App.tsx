import { useState } from "react";
import { Viewer } from "./features/viewer/Viewer";
import { Sidebar } from "./features/editor/Sidebar";
import { BoxScene } from "./features/editor/BoxScene";
import { FoldBar } from "./features/editor/FoldBar";
import { ArDialog } from "./features/ar/ArDialog";

export default function App() {
  const [arOpen, setArOpen] = useState(false);

  return (
    <div className="flex h-full bg-stone-100 text-stone-900">
      <Sidebar />
      <main className="relative flex-1 bg-stone-200">
        <Viewer>
          <BoxScene />
        </Viewer>

        <button
          type="button"
          onClick={() => setArOpen(true)}
          className="absolute right-4 top-4 rounded-lg bg-kraft-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-kraft-900"
        >
          Voir en AR
        </button>

        <FoldBar />
      </main>

      {arOpen && <ArDialog onClose={() => setArOpen(false)} />}
    </div>
  );
}
