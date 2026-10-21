import { useEffect, useState } from "react";
import { boxRoot } from "./boxRef";
import { exportBoxGlb } from "./exportGlb";

export function ArDialog({ onClose }: { onClose: () => void }) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Export du modèle à l'ouverture
  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;

    (async () => {
      try {
        await import("@google/model-viewer"); // chargé seulement maintenant
        const root = boxRoot.current;
        if (!root) throw new Error("La boîte n'est pas encore affichée.");
        const blob = await exportBoxGlb(root);
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
      } catch (e) {
        if (!cancelled)
          setError(
            e instanceof Error ? e.message : "L'export du modèle 3D a échoué.",
          );
      }
    })();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl); // libère la mémoire
    };
  }, []);

  // Fermeture avec la touche Échap
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ar-title"
      onClick={onClose}
      className="fixed inset-0 z-50 grid place-items-center bg-stone-900/50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-lg flex-col gap-4 rounded-2xl bg-white p-5 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="ar-title" className="text-lg font-semibold">
              Aperçu en réalité augmentée
            </h2>
            <p className="text-sm text-stone-500">
              Sur téléphone, touchez l'icône AR pour poser la boîte, à taille
              réelle, sur une table.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-md px-2 py-1 text-stone-500 hover:bg-stone-100 hover:text-stone-900"
          >
            ✕
          </button>
        </div>

        <div className="aspect-square w-full overflow-hidden rounded-xl bg-stone-100">
          {error ? (
            <p className="grid h-full place-items-center p-6 text-center text-sm text-red-600">
              {error}
            </p>
          ) : url ? (
            <model-viewer
              src={url}
              alt="Aperçu 3D de la boîte"
              ar
              ar-modes="webxr scene-viewer quick-look"
              ar-scale="fixed"
              camera-controls
              shadow-intensity="1"
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <p className="grid h-full place-items-center text-sm text-stone-500">
              Préparation du modèle 3D…
            </p>
          )}
        </div>

        {url && (
          <a
            href={url}
            download="kartona-boite.glb"
            className="self-start text-sm font-medium text-kraft-700 hover:underline"
          >
            Télécharger le modèle 3D (.glb)
          </a>
        )}
      </div>
    </div>
  );
}
