import { useId } from "react";
import { useEditor } from "./store";
import { PROCESSES } from "../print/processes";
import { Section } from "../../components/ui/Section";
import { Slider } from "../../components/ui/Slider";
import { Segmented } from "../../components/ui/Segmented";
import { LogoInput } from "../../components/ui/LogoInput";
import { InkSection } from "./InkSection";
import { Brand } from "../../components/ui/Brand";
export function Sidebar() {
  const box = useEditor((s) => s.box);
  const design = useEditor((s) => s.design);
  const setBox = useEditor((s) => s.setBox);
  const setDesign = useEditor((s) => s.setDesign);
  const setProcess = useEditor((s) => s.setProcess);
  const brandId = useId();
  const info = PROCESSES[design.process];

  return (
    <aside className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto border-t border-stone-200 bg-white md:order-first md:h-full md:w-80 md:flex-none md:shrink-0 md:border-r md:border-t-0">
      <header className="hidden border-b border-stone-200 px-5 py-4 md:block">
        <Brand />
      </header>

      <Section title="Dimensions intérieures">
        <Slider
          label="Longueur"
          unit="mm"
          value={box.length}
          min={100}
          max={600}
          step={5}
          onChange={(length) => setBox({ length })}
        />
        <Slider
          label="Largeur"
          unit="mm"
          value={box.width}
          min={80}
          max={400}
          step={5}
          onChange={(width) => setBox({ width })}
        />
        <Slider
          label="Hauteur"
          unit="mm"
          value={box.height}
          min={30}
          max={300}
          step={5}
          onChange={(height) => setBox({ height })}
        />
      </Section>

      <Section title="Carton">
        <Segmented
          label="Couche extérieure"
          value={design.substrate}
          options={[
            { value: "kraft", label: "Kraft" },
            { value: "white", label: "Blanc" },
          ]}
          onChange={(substrate) => setDesign({ substrate })}
        />
        <Segmented
          label="Cannelure"
          value={box.flute}
          options={[
            { value: "E", label: "E · 1,5 mm" },
            { value: "B", label: "B · 3 mm" },
          ]}
          onChange={(flute) => setBox({ flute })}
        />
      </Section>

      <Section title="Impression">
        <Segmented
          label="Procédé"
          value={design.process}
          options={[
            { value: "flexo", label: PROCESSES.flexo.label },
            { value: "offset", label: PROCESSES.offset.label },
          ]}
          onChange={setProcess}
        />
        <p className="-mt-2 text-xs leading-relaxed text-stone-500">
          {info.description}
        </p>
        <InkSection />
      </Section>

      <Section title="Design">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={brandId}
            className="rounded-lg border border-stone-300 px-3 py-2 text-base outline-none focus:border-kraft-500 focus:ring-2 focus:ring-kraft-100 md:text-sm"
          >
            Nom de la marque
          </label>
          <input
            id={brandId}
            type="text"
            maxLength={28}
            value={design.brand}
            onChange={(e) => setDesign({ brand: e.target.value })}
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-kraft-500 focus:ring-2 focus:ring-kraft-100"
          />
        </div>
        <LogoInput
          value={design.logoUrl}
          onChange={(logoUrl) => setDesign({ logoUrl })}
        />
        <Slider
          label="Taille du logo"
          unit="%"
          value={design.logoScale}
          min={20}
          max={90}
          onChange={(logoScale) => setDesign({ logoScale })}
        />
      </Section>
    </aside>
  );
}
