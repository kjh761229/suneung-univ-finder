import { DEFAULT_WEIGHTS, ENG_PENALTY, HIST_PENALTY, LIMITS, MAX, TOTAL } from "./config";
import type { Department, StudentScores, University, Weights } from "./types";

export interface RawScore {
  kor: number;
  math: number;
  /** 탐구 2과목 합계 */
  inq: number;
  eng: number;
  hist: number;
}

const round1 = (x: number) => Math.round(x * 10) / 10;

function penalty(table: number[] | undefined, grade: number): number {
  const t = table ?? ENG_PENALTY.normal;
  const idx = Math.min(Math.max(Math.round(grade), 1), 9) - 1;
  return t[idx];
}

export function engPenalty(univ: University, grade: number): number {
  return penalty(ENG_PENALTY[univ.engPreset] ?? ENG_PENALTY.normal, grade);
}

export function histPenalty(univ: University, grade: number): number {
  return penalty(HIST_PENALTY[univ.histPreset] ?? HIST_PENALTY.normal, grade);
}

export function weightsFor(dept: Department): Weights {
  return dept.weights ?? DEFAULT_WEIGHTS[dept.track];
}

/** 대학·학과 기준 환산점수 (1000점 만점, 소수 첫째 자리) */
export function convertScore(raw: RawScore, univ: University, dept: Department): number {
  const w = weightsFor(dept);
  const wSum = w.kor + w.math + w.inq;
  const base =
    (raw.kor / MAX.kor) * w.kor +
    (raw.math / MAX.math) * w.math +
    (raw.inq / MAX.inq) * w.inq;
  const score = (TOTAL * base) / wSum - engPenalty(univ, raw.eng) - histPenalty(univ, raw.hist);
  return round1(score);
}

export function toRaw(s: StudentScores): RawScore {
  return { kor: s.kor, math: s.math, inq: s.inq1 + s.inq2, eng: s.eng, hist: s.hist };
}

/** 입력값 검증. 문제가 있으면 필드별 오류 메시지 반환 */
export function validateScores(s: Partial<Record<keyof StudentScores, unknown>>): Partial<Record<keyof StudentScores, string>> {
  const errors: Partial<Record<keyof StudentScores, string>> = {};
  const check = (key: keyof StudentScores, min: number, max: number, label: string, integer = false) => {
    const v = s[key];
    if (typeof v !== "number" || Number.isNaN(v)) {
      errors[key] = `${label}을(를) 입력하세요.`;
    } else if (v < min || v > max) {
      errors[key] = `${label}은(는) ${min}~${max} 사이여야 합니다.`;
    } else if (integer && !Number.isInteger(v)) {
      errors[key] = `${label}은(는) 정수여야 합니다.`;
    }
  };
  check("kor", LIMITS.std.min, LIMITS.std.max, "국어 표준점수");
  check("math", LIMITS.std.min, LIMITS.std.max, "수학 표준점수");
  check("inq1", LIMITS.inq.min, LIMITS.inq.max, "탐구1 표준점수");
  check("inq2", LIMITS.inq.min, LIMITS.inq.max, "탐구2 표준점수");
  check("eng", LIMITS.grade.min, LIMITS.grade.max, "영어 등급", true);
  check("hist", LIMITS.grade.min, LIMITS.grade.max, "한국사 등급", true);
  if (s.track !== "humanities" && s.track !== "science") errors.track = "계열을 선택하세요.";
  return errors;
}
