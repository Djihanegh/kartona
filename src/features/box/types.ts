export type Substrate = "kraft" | "white";

export type FaceId =
  | "bottom"
  | "front"
  | "back"
  | "left"
  | "right"
  | "lid"
  | "flap";

export interface Design {
  substrate: Substrate;
  brand: string;
  inkColor: string;
}
