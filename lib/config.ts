import type { Tier, Track, Weights } from "./types";

/** 정규화 기준 만점 (표준점수) */
export const MAX = {
  kor: 150,
  math: 150,
  /** 탐구 2과목 합계 */
  inq: 160,
} as const;

/** 환산점수 만점 */
export const TOTAL = 1000;

/** 계열별 기본 반영비율 (%) */
export const DEFAULT_WEIGHTS: Record<Track, Weights> = {
  humanities: { kor: 35, math: 35, inq: 30 },
  science: { kor: 25, math: 40, inq: 35 },
};

/** 영어 등급별 감점 (1~9등급, 1000점 기준) */
export const ENG_PENALTY: Record<string, number[]> = {
  strong: [0, 10, 25, 45, 70, 95, 120, 145, 170],
  normal: [0, 5, 15, 30, 50, 70, 90, 110, 130],
  mild: [0, 3, 8, 15, 25, 40, 55, 70, 85],
};

/** 한국사 등급별 감점 (1~9등급, 1000점 기준) */
export const HIST_PENALTY: Record<string, number[]> = {
  normal: [0, 0, 0, 2, 4, 6, 8, 10, 12],
  strict: [0, 0, 5, 10, 15, 20, 25, 30, 35],
};

/**
 * 분류 기준: (내 환산점수 - 합격선 환산점수)
 *  diff >= safe  → 안정
 *  diff >= match → 적정
 *  diff >= reach → 소신
 *  그 미만은 추천에서 제외
 */
export const THRESHOLDS = {
  safe: 15,
  match: -10,
  reach: -30,
} as const;

export const TIER_LABEL: Record<Tier, string> = {
  safe: "안정",
  match: "적정",
  reach: "소신",
};

export const TRACK_LABEL: Record<Track, string> = {
  humanities: "인문",
  science: "자연",
};

/** 입력 허용 범위 */
export const LIMITS = {
  std: { min: 0, max: 200 },
  inq: { min: 0, max: 100 },
  grade: { min: 1, max: 9 },
} as const;
