import type { BaseModelResponse } from "../common/common";
import type { Document } from "../document/document";

export type Progression = BaseModelResponse & {
  inProgress: Document[];
  complete: Document[];
  favorites: Document[];
};

export type UpdateProgression = {
  progress?: string;
  complete?: string;
  favorite?: string;
};
