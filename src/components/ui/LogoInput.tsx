import { useRef } from "react";

interface LogoInputProps {
  value: string | null;
  onChange: (url: string | null) => void;
}

export function LogoInput({ value, onChange }: LogoInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const readFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm text-stone-700">Logo</span>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file) readFile(file);
        }}
        className="flex items-center gap-3 rounded-lg border border-dashed border-stone-300 p-3"
      >
        <div className="grid size-14 shrink-0 place-items-center rounded-md bg-stone-100">
          {value ? (
            <img
              src={value}
              alt="Logo importé"
              className="max-h-12 max-w-12 object-contain"
            />
          ) : (
            <span className="text-xs text-stone-400">Aucun</span>
          )}
        </div>
        <div className="flex flex-col items-start gap-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-sm font-medium text-kraft-700 hover:underline"
          >
            {value ? "Remplacer" : "Importer un fichier"}
          </button>
          {value ? (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="text-xs text-stone-500 hover:text-red-600"
            >
              Retirer
            </button>
          ) : (
            <span className="text-xs text-stone-400">
              PNG, JPG ou SVG, ou glissez-le ici
            </span>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml,image/webp"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) readFile(file);
            e.target.value = ""; // permet de réimporter le même fichier
          }}
        />
      </div>
    </div>
  );
}
