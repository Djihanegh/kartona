import { createRef } from "react";
import type { Group } from "three";

// Référence partagée vers la boîte 3D affichée, pour pouvoir l'exporter
// depuis l'extérieur de la scène (un bouton, une fenêtre…)
export const boxRoot = createRef<Group>();
