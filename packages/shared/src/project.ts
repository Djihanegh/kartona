import { z } from "zod";
import { BoxParamsSchema } from "./box";
import { DesignSpecSchema } from "./design";

export const ProjectContentSchema = z.object({
  box: BoxParamsSchema,
  design: DesignSpecSchema,
});
export type ProjectContent = z.infer<typeof ProjectContentSchema>;
