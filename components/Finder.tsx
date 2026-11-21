"use client";

import { useMemo, useRef, useState } from "react";
import ResultCard, { TIER_STYLE } from "./ResultCard";
import ScoreForm from "./ScoreForm";
import { THRESHOLDS, TIER_LABEL, TRACK_LABEL } from "@/lib/config";
import { regions, universities } from "@/lib/data";
import { recommend } from "@/lib/recommend";
import type { Recommendation, StudentScores, Tier } from "@/lib/types";

type Sort = "diff" | "score" | "name";
const TIERS: Tier[] = ["safe", "match", "reach"];

const TIER_DESC: Record<Tier, string> = {
  safe: `합격선보다 ${THRESHOLDS.safe}점 이상 높음`,
  match: `합격선 ${THRESHOLDS.match} ~ +${THRESHOLDS.safe}점`,
  reach: `합격선 ${THRESHOLDS.reach} ~ ${THRESHOLDS.match}점`,
};

const selectCls =
  "rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-800 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200";

function sortList(list: Recommendation[], sort: Sort) {
  const copy = [...list];
  if (sort === "score") copy.sort((a, b) => b.cutScore - a.cutScore);
  else if (sort === "name") copy.sort((a, b) => a.universityName.localeCompare(b.universityName, "ko"));
  else copy.sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff));
  return copy;
}

export default function Finder() {
  const [scores, setScores] = useState<StudentScores | null>(null);
  const [region, setRegion] = useState("전체");
  const [type, setType] = useState("전체");
  const [sort, setSort] = useState<Sort>("diff");
  const resultRef = useRef<HTMLElement>(null);

  const all = useMemo(() => (scores ? recommend(scores, universities) : []), [scores]);

  const filtered = useMemo(
    () =>
      all.filter(
        (r) =>
          (region === "전체" || r.region === region) &&
          (type === "전체" || (type === "국공립" ? r.type !== "사립" : r.type === "사립")),
      ),
    [all, region, type],
  );

  function handleSubmit(s: StudentScores) {
    setScores(s);
    requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr] lg:items-start">
      <div className="lg:sticky lg:top-6">
        <ScoreForm onSubmit={handleSubmit} />
      </div>

      <section ref={resultRef} className="min-w-0 scroll-mt-6" aria-live="polite">
        {!scores ? (
          <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
            <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">성적을 입력하면 추천 결과가 여기에 표시됩니다</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              왼쪽 위의 &lsquo;예시 성적 채우기&rsquo;로 바로 체험해 보세요.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {TRACK_LABEL[scores.track]}계열 추천 결과{" "}
                  <span className="text-indigo-600 dark:text-indigo-400">{filtered.length}곳</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  국 {scores.kor} · 수 {scores.math} · 탐 {scores.inq1}+{scores.inq2} · 영 {scores.eng}등급 · 한 {scores.hist}등급
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <select className={selectCls} value={region} onChange={(e) => setRegion(e.target.value)} aria-label="지역">
                  <option>전체</option>
                  {regions.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
                <select className={selectCls} value={type} onChange={(e) => setType(e.target.value)} aria-label="설립유형">
                  <option>전체</option>
                  <option>국공립</option>
                  <option>사립</option>
                </select>
                <select className={selectCls} value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="정렬">
                  <option value="diff">합격선 근접순</option>
                  <option value="score">합격선 높은순</option>
                  <option value="name">이름순</option>
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                조건에 맞는 추천 대학이 없습니다. 필터를 바꾸거나 성적을 다시 확인해 주세요.
              </div>
            ) : (
              <div className="space-y-8">
                {TIERS.map((tier) => {
                  const list = sortList(
                    filtered.filter((r) => r.tier === tier),
                    sort,
                  );
                  return (
                    <div key={tier}>
                      <div className="mb-3 flex items-baseline gap-2">
                        <span className={`rounded-full px-3 py-1 text-sm font-bold ${TIER_STYLE[tier].badge}`}>
                          {TIER_LABEL[tier]} {list.length}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{TIER_DESC[tier]}</span>
                      </div>
                      {list.length === 0 ? (
                        <p className="text-sm text-slate-400">해당 없음</p>
                      ) : (
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                          {list.map((r) => (
                            <ResultCard key={`${r.universityId}-${r.department}`} r={r} />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
