import { THRESHOLDS } from "./config";
import { convertScore, engPenalty, histPenalty, toRaw, weightsFor } from "./score";
import type { Recommendation, StudentScores, Tier, University } from "./types";

export function classify(diff: number): Tier | null {
  if (diff >= THRESHOLDS.safe) return "safe";
  if (diff >= THRESHOLDS.match) return "match";
  if (diff >= THRESHOLDS.reach) return "reach";
  return null;
}

/** 학생 성적에 맞는 학과를 안정/적정/소신으로 분류해 반환 (합격선과의 차이가 작은 순) */
export function recommend(scores: StudentScores, universities: University[]): Recommendation[] {
  const raw = toRaw(scores);
  const results: Recommendation[] = [];

  for (const univ of universities) {
    for (const dept of univ.departments) {
      if (dept.track !== scores.track) continue;
      const myScore = convertScore(raw, univ, dept);
      const cutScore = convertScore(dept.cut, univ, dept);
      const diff = Math.round((myScore - cutScore) * 10) / 10;
      const tier = classify(diff);
      if (!tier) continue;
      results.push({
        universityId: univ.id,
        universityName: univ.name,
        region: univ.region,
        type: univ.type,
        department: dept.name,
        tier,
        myScore,
        cutScore,
        diff,
        weights: weightsFor(dept),
        engPenalty: engPenalty(univ, scores.eng),
        histPenalty: histPenalty(univ, scores.hist),
      });
    }
  }

  return results.sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff));
}
