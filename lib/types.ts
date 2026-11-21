export type Track = "humanities" | "science";

/** 학생이 입력하는 수능 성적 */
export interface StudentScores {
  track: Track;
  /** 국어 표준점수 */
  kor: number;
  /** 수학 표준점수 */
  math: number;
  /** 탐구 1 표준점수 */
  inq1: number;
  /** 탐구 2 표준점수 */
  inq2: number;
  /** 영어 등급 (1~9) */
  eng: number;
  /** 한국사 등급 (1~9) */
  hist: number;
}

export interface Weights {
  kor: number;
  math: number;
  inq: number;
}

/** 합격선(70% 컷) 학생의 성적 프로필. inq는 탐구 2과목 합계. */
export interface CutProfile {
  kor: number;
  math: number;
  inq: number;
  eng: number;
  hist: number;
}

export interface Department {
  name: string;
  track: Track;
  cut: CutProfile;
  /** 지정하지 않으면 계열 기본 반영비율 사용 */
  weights?: Weights;
}

export interface University {
  id: string;
  name: string;
  region: string;
  type: string;
  engPreset: string;
  histPreset: string;
  departments: Department[];
}

export interface UniversityData {
  sample: boolean;
  year: string;
  universities: University[];
}

export type Tier = "safe" | "match" | "reach";

export interface Recommendation {
  universityId: string;
  universityName: string;
  region: string;
  type: string;
  department: string;
  tier: Tier;
  myScore: number;
  cutScore: number;
  diff: number;
  weights: Weights;
  engPenalty: number;
  histPenalty: number;
}
