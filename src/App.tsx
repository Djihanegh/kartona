import { Viewer } from "./features/viewer/Viewer";
import { Sidebar } from "./features/editor/Sidebar";
import { BoxScene } from "./features/editor/BoxScene";
import { FoldBar } from "./features/editor/FoldBar";

export default function App() {
  return (
    <div className="flex h-full bg-stone-100 text-stone-900">
      <Sidebar />
      <main className="relative flex-1 bg-stone-200">
        <Viewer>
          <BoxScene />
        </Viewer>
        <FoldBar />
      </main>
    </div>
  );
}
