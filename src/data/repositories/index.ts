import { cache } from "react";
import type { ContentRepository } from "./contract";
import { createPostgresRepository } from "./postgres";

export const contentRepository = cache(async (): Promise<ContentRepository> =>
  createPostgresRepository(),
);

export type { ContentRepository, ListOptions, BySlugOptions } from "./contract";
