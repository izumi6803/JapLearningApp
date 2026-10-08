import type { LessonSeed } from "@/lib/types";
import { advanced } from "./advanced";
import { n5 } from "./n5";

/** Raw seed data — used to populate the lessons table on first run. */
export const lessonSeeds: LessonSeed[] = [...n5, ...advanced];
