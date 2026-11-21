"use client";

import { useState } from "react";
import { TRACK_LABEL } from "@/lib/config";
import { validateScores } from "@/lib/score";
import type { StudentScores, Track } from "@/lib/types";

type FormState = Record<"kor" | "math" | "inq1" | "inq2", string> & {
  track: Track;
  eng: string;
  hist: string;
};

const EMPTY: FormState = { track: "humanities", kor: "", math: "", inq1: "", inq2: "", eng: "1", hist: "1" };
const EXAMPLE: FormState = { track: "humanities", kor: "128", math: "126", inq1: "65", inq2: "63", eng: "2", hist: "2" };

const GRADES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-indigo-900";

export default function ScoreForm({ onSubmit }: { onSubmit: (s: StudentScores) => void }) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof StudentScores, string>>>({});

  const set = (key: keyof FormState, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const toNum = (v: string) => (v.trim() === "" ? NaN : Number(v));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const scores: StudentScores = {
      track: form.track,
      kor: toNum(form.kor),
      math: toNum(form.math),
      inq1: toNum(form.inq1),
      inq2: toNum(form.inq2),
      eng: toNum(form.eng),
      hist: toNum(form.hist),
    };
    const errs = validateScores(scores);
    setErrors(errs);
    if (Object.keys(errs).length === 0) onSubmit(scores);
  }

  const numField = (key: "kor" | "math" | "inq1" | "inq2", label: string, placeholder: string) => (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      <input
        type="number"
        inputMode="decimal"
        step="any"
        className={inputCls}
        placeholder={placeholder}
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
        aria-invalid={!!errors[key]}
      />
      {errors[key] && <span className="mt-1 block text-xs text-rose-600">{errors[key]}</span>}
    </label>
  );

  const gradeField = (key: "eng" | "hist", label: string) => (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      <select className={inputCls} value={form[key]} onChange={(e) => set(key, e.target.value)}>
        {GRADES.map((g) => (
          <option key={g} value={g}>
            {g}등급
          </option>
        ))}
      </select>
      {errors[key] && <span className="mt-1 block text-xs text-rose-600">{errors[key]}</span>}
    </label>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">수능 성적 입력</h2>
        <button
          type="button"
          onClick={() => {
            setForm(EXAMPLE);
            setErrors({});
          }}
          className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        >
          예시 성적 채우기
        </button>
      </div>

      <fieldset className="mb-5">
        <legend className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">계열</legend>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(TRACK_LABEL) as Track[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => set("track", t)}
              aria-pressed={form.track === t}
              className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                form.track === t
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:border-indigo-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300"
              }`}
            >
              {TRACK_LABEL[t]}계열
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-2 gap-4">
        {numField("kor", "국어 (표준점수)", "예: 128")}
        {numField("math", "수학 (표준점수)", "예: 126")}
        {numField("inq1", "탐구1 (표준점수)", "예: 65")}
        {numField("inq2", "탐구2 (표준점수)", "예: 63")}
        {gradeField("eng", "영어 (등급)")}
        {gradeField("hist", "한국사 (등급)")}
      </div>

      <button
        type="submit"
        className="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-3 text-base font-bold text-white shadow transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300"
      >
        추천 대학 보기
      </button>
    </form>
  );
}
