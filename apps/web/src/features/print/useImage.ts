import { useEffect, useState } from "react";

export function useImage(src: string | undefined): HTMLImageElement | null {
  const [loaded, setLoaded] = useState<{
    src: string;
    img: HTMLImageElement;
  } | null>(null);

  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.onload = () => setLoaded({ src, img });
    img.src = src;
    return () => {
      img.onload = null; // on ignore une image qui arrive après un changement
    };
  }, [src]);

  // On ne renvoie l'image que si elle correspond à la source actuelle
  return loaded && loaded.src === src ? loaded.img : null;
}
