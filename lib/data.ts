import raw from "../data/universities.json";
import type { UniversityData } from "./types";

export const universityData = raw as UniversityData;
export const universities = universityData.universities;

export const regions = Array.from(new Set(universities.map((u) => u.region)));
