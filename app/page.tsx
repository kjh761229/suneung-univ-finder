import Finder from "@/components/Finder";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:py-12">
      <header className="mb-6">
        <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">수능 정시 지원 가이드</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50">
          내 수능 점수로 갈 수 있는 대학 찾기
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          표준점수와 등급을 입력하면 대학별 환산점수를 계산해 안정 · 적정 · 소신으로 나눠 보여드립니다.
        </p>
      </header>

      <div
        role="note"
        className="mb-8 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200"
      >
        <b>예시 데이터 안내</b> · 현재 합격선과 반영비율은 기능 시연용 <b>가상 수치</b>이며 실제 입시 결과가 아닙니다. 실제
        지원 시에는 각 대학 모집요강과 대학어디가(adiga.kr)의 공식 자료를 확인하세요.
      </div>

      <Finder />

      <footer className="mt-16 border-t border-slate-200 pt-6 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500">
        본 서비스의 결과는 참고용이며 합격을 보장하지 않습니다.
      </footer>
    </div>
  );
}
