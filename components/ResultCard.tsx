"use client";

import { useState } from "react";
import { TIER_LABEL } from "@/lib/config";
import type { Recommendation, Tier } from "@/lib/types";

export const TIER_STYLE: Record<Tier, { badge: string; ring: string; text: string }> = {
  safe: {
    badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300",
    ring: "border-emerald-200 dark:border-emerald-800",
    text: "text-emerald-700 dark:text-emerald-400",
  },
  match: {
    badge: "bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300",
    ring: "border-sky-200 dark:border-sky-800",
    text: "text-sky-700 dark:text-sky-400",
  },
  reach: {
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
    ring: "border-amber-200 dark:border-amber-800",
    text: "text-amber-700 dark:text-amber-400",
  },
};

export default function ResultCard({ r }: { r: Recommendation }) {
  const [open, setOpen] = useState(false);
  const s = TIER_STYLE[r.tier];
  const sign = r.diff > 0 ? "+" : "";

  return (
    <article className={`rounded-xl border bg-white p-4 shadow-sm dark:bg-slate-800 ${s.ring}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="truncate text-base font-bold text-slate-900 dark:text-slate-100">{r.universityName}</h4>
          <p className="truncate text-sm text-slate-600 dark:text-slate-400">{r.department}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${s.badge}`}>{TIER_LABEL[r.tier]}</span>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
        <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-600 dark:bg-slate-700 dark:text-slate-300">{r.region}</span>
        <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-600 dark:bg-slate-700 dark:text-slate-300">{r.type}</span>
      </div>

      <div className="mt-3 flex items-end justify-between">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          내 점수 <b className="text-slate-800 dark:text-slate-200">{r.myScore.toFixed(1)}</b>
          <span className="mx-1">/</span>
          합격선 <b className="text-slate-800 dark:text-slate-200">{r.cutScore.toFixed(1)}</b>
        </div>
        <div className={`text-lg font-extrabold tabular-nums ${s.text}`}>
          {sign}
          {r.diff.toFixed(1)}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="mt-3 text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        aria-expanded={open}
      >
        {open ? "상세 닫기" : "반영 기준 보기"}
      </button>

      {open && (
        <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 rounded-lg bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-900 dark:text-slate-400">
          <dt>반영비율</dt>
          <dd className="text-right text-slate-800 dark:text-slate-200">
            국 {r.weights.kor} · 수 {r.weights.math} · 탐 {r.weights.inq}
          </dd>
          <dt>영어 감점 (내 등급)</dt>
          <dd className="text-right text-slate-800 dark:text-slate-200">−{r.engPenalty}</dd>
          <dt>한국사 감점 (내 등급)</dt>
          <dd className="text-right text-slate-800 dark:text-slate-200">−{r.histPenalty}</dd>
          <dt>환산 만점</dt>
          <dd className="text-right text-slate-800 dark:text-slate-200">1000</dd>
        </dl>
      )}
    </article>
  );
}
