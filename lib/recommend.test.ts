import { describe, expect, it } from "vitest";
import raw from "../data/universities.json";
import { classify, recommend } from "./recommend";
import { convertScore, validateScores } from "./score";
import type { StudentScores, University, UniversityData } from "./types";

const universities = (raw as UniversityData).universities;

const univ: University = {
  id: "t",
  name: "테스트대",
  region: "서울",
  type: "사립",
  engPreset: "normal",
  histPreset: "normal",
  departments: [
    { name: "인문학과", track: "humanities", cut: { kor: 120, math: 120, inq: 120, eng: 2, hist: 1 } },
  ],
};
const dept = univ.departments[0];

const student = (over: Partial<StudentScores> = {}): StudentScores => ({
  track: "humanities",
  kor: 128,
  math: 126,
  inq1: 65,
  inq2: 63,
  eng: 2,
  hist: 2,
  ...over,
});

describe("convertScore", () => {
  it("만점이면 1000점", () => {
    expect(convertScore({ kor: 150, math: 150, inq: 160, eng: 1, hist: 1 }, univ, dept)).toBe(1000);
  });

  it("영어·한국사 등급 감점을 반영", () => {
    const base = { kor: 150, math: 150, inq: 160, hist: 1 };
    expect(convertScore({ ...base, eng: 3 }, univ, dept)).toBe(1000 - 15);
    expect(convertScore({ ...base, eng: 1, hist: 5 }, univ, dept)).toBe(1000 - 4);
  });

  it("점수가 높을수록 환산점수도 높다", () => {
    const lo = convertScore({ kor: 110, math: 110, inq: 110, eng: 2, hist: 1 }, univ, dept);
    const hi = convertScore({ kor: 130, math: 130, inq: 130, eng: 2, hist: 1 }, univ, dept);
    expect(hi).toBeGreaterThan(lo);
  });
});

describe("classify", () => {
  it("경계값 분류", () => {
    expect(classify(15)).toBe("safe");
    expect(classify(14.9)).toBe("match");
    expect(classify(-10)).toBe("match");
    expect(classify(-10.1)).toBe("reach");
    expect(classify(-30)).toBe("reach");
    expect(classify(-30.1)).toBeNull();
  });
});

describe("recommend", () => {
  it("선택한 계열 학과만 추천", () => {
    const r = recommend(student({ track: "science" }), universities);
    expect(r.length).toBeGreaterThan(0);
    const sciNames = new Set(
      universities.flatMap((u) => u.departments.filter((d) => d.track === "science").map((d) => `${u.name}/${d.name}`)),
    );
    for (const x of r) expect(sciNames.has(`${x.universityName}/${x.department}`)).toBe(true);
  });

  it("예시 성적이면 안정·적정·소신이 모두 나온다", () => {
    const tiers = new Set(recommend(student(), universities).map((r) => r.tier));
    expect(tiers).toEqual(new Set(["safe", "match", "reach"]));
  });

  it("성적이 오르면 추천 대학의 최고 합격선도 오른다", () => {
    const top = (s: StudentScores) => Math.max(...recommend(s, universities).map((r) => r.cutScore));
    expect(top(student({ kor: 138, math: 136, inq1: 69, inq2: 68 }))).toBeGreaterThan(top(student()));
  });
});

describe("validateScores", () => {
  it("정상 입력이면 오류 없음", () => {
    expect(validateScores(student())).toEqual({});
  });

  it("빈 값·범위 초과·소수 등급을 잡아낸다", () => {
    const e = validateScores({ ...student(), kor: NaN, math: 250, eng: 2.5 });
    expect(Object.keys(e).sort()).toEqual(["eng", "kor", "math"]);
  });
});
