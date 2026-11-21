# 수능 점수 대학 추천 (suneung-univ-finder)

수능 표준점수(국어·수학·탐구)와 등급(영어·한국사)을 입력하면 대학별 환산점수를 계산해
**안정 / 적정 / 소신**으로 나눠 추천하는 웹 서비스입니다.

🔗 **서비스 주소:** https://suneung-univ-finder.vercel.app

> ⚠️ `data/universities.json`의 합격선·반영 기준은 기능 시연용 **가상 수치**입니다. 실제 입시 결과가 아닙니다.

## 기술 스택
- Next.js 16 (App Router) · TypeScript · Tailwind CSS 4
- 정적 JSON 데이터 + 브라우저 계산 (서버·DB 없음)
- Vitest 단위 테스트

## 실행
```bash
npm install
npm run dev     # http://localhost:3000
npm test        # 계산 로직 테스트
npm run build   # 프로덕션 빌드
```

## 추천 방식
1. 대학·학과별 반영비율로 환산점수(1000점 만점)를 계산합니다.
   `1000 × (국/150×w국 + 수/150×w수 + 탐합/160×w탐) / Σw − 영어감점 − 한국사감점`
2. 같은 공식으로 합격선(70% 컷) 프로필의 환산점수를 계산합니다.
3. 차이(내 점수 − 합격선)로 분류합니다: `+15 이상` 안정, `−10 ~ +15` 적정, `−30 ~ −10` 소신.

기준값은 [lib/config.ts](lib/config.ts)에서 바꿀 수 있습니다.

## 실제 데이터로 바꾸기
`data/universities.json`의 각 학과 항목을 실제 값으로 교체하면 됩니다.

```json
{
  "id": "snu", "name": "서울대학교", "region": "서울", "type": "국립",
  "engPreset": "mild", "histPreset": "strict",
  "departments": [
    {
      "name": "경영학과", "track": "humanities",
      "cut": { "kor": 140, "math": 137, "inq": 137, "eng": 1, "hist": 1 },
      "weights": { "kor": 35, "math": 35, "inq": 30 }
    }
  ]
}
```
- `cut.inq`는 탐구 2과목 표준점수 합계, `weights`는 생략 시 계열 기본값 사용
- `engPreset`/`histPreset`: `lib/config.ts`의 감점표 이름 (`strong`·`normal`·`mild` / `normal`·`strict`)

## 배포
GitHub 저장소를 Vercel에 연결하면 `main` 브랜치에 push할 때마다 자동으로 운영 배포됩니다.
