// app/(auth)/profile/page.tsx

import { redirect } from "next/navigation";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatTime, formatToKorean12Hour } from "@/lib/utils";
import Link from "next/link";

const parseScore = (scoreStr: string) => {
  const num = parseInt(scoreStr.replace(/[^0-9]/g, ""), 10);
  return Number.isNaN(num) ? 0 : num;
};

const ProfilePage = async () => {
  const session = await getSession();

  if (!session.id) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: session.id },
    include: {
      Interview: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const interviews = user.Interview;
  const totalInterviews = interviews.length;
  const hasInterview = totalInterviews > 0;

  let avgTotalScore = 0;
  let avgTechScore = 0;
  let avgSoftScore = 0;
  let avgCommScore = 0;
  let avgProblemScore = 0;
  let totalSeconds = 0;

  const categoryCount = new Map<string, number>();
  const difficultyCount = new Map<string, number>();
  const gradeCount = new Map<string, number>();

  if (hasInterview) {
    let sumTotal = 0;
    let sumTech = 0;
    let sumSoft = 0;
    let sumComm = 0;
    let sumProb = 0;

    for (const iv of interviews) {
      const total = parseScore(iv.totalScore);
      const tech = parseScore(iv.techScore);
      const soft = parseScore(iv.softScore);
      const comm = parseScore(iv.communicationScore);
      const prob = parseScore(iv.problemSolvingScore);

      sumTotal += total;
      sumTech += tech;
      sumSoft += soft;
      sumComm += comm;
      sumProb += prob;

      totalSeconds += iv.timeSpend;

      categoryCount.set(iv.category, (categoryCount.get(iv.category) ?? 0) + 1);
      difficultyCount.set(
        iv.difficulty,
        (difficultyCount.get(iv.difficulty) ?? 0) + 1
      );
      gradeCount.set(iv.grade, (gradeCount.get(iv.grade) ?? 0) + 1);
    }

    const n = totalInterviews || 1;
    avgTotalScore = Math.round((sumTotal / n) * 10) / 10;
    avgTechScore = Math.round((sumTech / n) * 10) / 10;
    avgSoftScore = Math.round((sumSoft / n) * 10) / 10;
    avgCommScore = Math.round((sumComm / n) * 10) / 10;
    avgProblemScore = Math.round((sumProb / n) * 10) / 10;
  }

  let topCategory: string | null = null;
  let topCategoryCount = 0;
  for (const [cat, cnt] of categoryCount.entries()) {
    if (cnt > topCategoryCount) {
      topCategory = cat;
      topCategoryCount = cnt;
    }
  }

  let topDifficulty: string | null = null;
  let topDifficultyCount = 0;
  for (const [dif, cnt] of difficultyCount.entries()) {
    if (cnt > topDifficultyCount) {
      topDifficulty = dif;
      topDifficultyCount = cnt;
    }
  }

  const recentInterviews = [...interviews]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 3);

  const totalMinutes = Math.floor(totalSeconds / 60);

  // ▼ 간단 추천 문구
  let mainSuggestion: string | null = null;
  if (hasInterview) {
    const pairs: { key: "tech" | "soft" | "comm" | "prob"; value: number }[] = [
      { key: "tech", value: avgTechScore },
      { key: "soft", value: avgSoftScore },
      { key: "comm", value: avgCommScore },
      { key: "prob", value: avgProblemScore },
    ];

    const lowest = pairs.reduce((min, cur) =>
      cur.value < min.value ? cur : min
    );

    if (lowest.key === "soft") {
      mainSuggestion =
        "소프트 스킬 관련 질문(협업, 갈등 해결, 성향 등)을 중심으로 추가 연습해 보면 좋겠습니다.";
    } else if (lowest.key === "comm") {
      mainSuggestion =
        "답변 구조화와 말하기 속도/톤을 의식하면서, 커뮤니케이션 측면을 조금 더 의도적으로 연습해 보세요.";
    } else if (lowest.key === "prob") {
      mainSuggestion =
        "문제 해결 과정을 단계적으로 설명하는 연습을 통해, 사고 과정을 더 명확하게 보여줄 수 있습니다.";
    } else {
      mainSuggestion =
        "전반적인 점수가 고르게 형성되어 있습니다. 실제 기업 공고와 JD를 기준으로 한 실전 연습으로 확장해 보세요.";
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-6 border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">마이 페이지</h1>
          <Link href="/">홈으로</Link>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          계정 정보와 지금까지의 면접 기록을 한눈에 확인할 수 있습니다.
        </p>
      </header>

      {/* 계정 정보 */}
      <section className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-base font-semibold">계정 정보</h2>
        <dl className="grid gap-3 text-sm md:grid-cols-2">
          <div>
            <dt className="text-xs text-gray-500">사용자 이름</dt>
            <dd className="text-gray-900">{user.username}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">이메일</dt>
            <dd className="text-gray-900">{user.email}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">가입일</dt>
            <dd className="text-gray-900">
              {user.createdAt.toLocaleDateString("ko-KR")}{" "}
              {formatToKorean12Hour(user.createdAt)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">총 모의 면접 횟수</dt>
            <dd className="text-gray-900">{totalInterviews}회</dd>
          </div>
        </dl>
      </section>

      {/* 통계 요약 */}
      <section className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-base font-semibold">면접 통계 요약</h2>

        {!hasInterview ? (
          <p className="text-sm text-gray-500">
            아직 진행한 모의 면접이 없습니다. 첫 면접을 시작해보세요!
          </p>
        ) : (
          <>
            <div className="mb-4 grid gap-3 md:grid-cols-4">
              <div className="rounded-md bg-sky-50 p-3">
                <p className="text-xs text-gray-500">평균 총점</p>
                <p className="mt-1 text-lg font-semibold text-sky-700">
                  {avgTotalScore}
                </p>
              </div>
              <div className="rounded-md bg-emerald-50 p-3">
                <p className="text-xs text-gray-500">평균 기술 역량</p>
                <p className="mt-1 text-lg font-semibold text-emerald-700">
                  {avgTechScore}
                </p>
              </div>
              <div className="rounded-md bg-indigo-50 p-3">
                <p className="text-xs text-gray-500">평균 소프트 스킬</p>
                <p className="mt-1 text-lg font-semibold text-indigo-700">
                  {avgSoftScore}
                </p>
              </div>
              <div className="rounded-md bg-amber-50 p-3">
                <p className="text-xs text-gray-500">총 연습 시간</p>
                <p className="mt-1 text-lg font-semibold text-amber-700">
                  약 {totalMinutes}분
                </p>
                <p className="mt-0.5 text-[11px] text-amber-700">
                  ({formatTime(totalSeconds)})
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <h3 className="mb-1 text-xs font-semibold text-gray-700">
                  자주 연습한 직무
                </h3>
                {topCategory ? (
                  <p className="text-sm text-gray-900">
                    {topCategory} ({topCategoryCount}회)
                  </p>
                ) : (
                  <p className="text-xs text-gray-400">
                    집계된 직무 정보가 없습니다.
                  </p>
                )}
              </div>
              <div>
                <h3 className="mb-1 text-xs font-semibold text-gray-700">
                  가장 많이 선택한 난이도
                </h3>
                {topDifficulty ? (
                  <p className="text-sm text-gray-900">
                    {topDifficulty} ({topDifficultyCount}회)
                  </p>
                ) : (
                  <p className="text-xs text-gray-400">
                    집계된 난이도 정보가 없습니다.
                  </p>
                )}
              </div>
              <div>
                <h3 className="mb-1 text-xs font-semibold text-gray-700">
                  등급 분포
                </h3>
                {gradeCount.size ? (
                  <ul className="space-y-0.5 text-xs text-gray-800">
                    {Array.from(gradeCount.entries())
                      .sort((a, b) => b[1] - a[1])
                      .map(([grade, cnt]) => (
                        <li key={grade}>
                          {grade}: {cnt}회
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-400">
                    등급 정보가 아직 없습니다.
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </section>

      {/* 학습 추천 */}
      {hasInterview && (
        <section className="mb-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
          <h2 className="mb-2 text-base font-semibold text-blue-800">
            학습 추천
          </h2>
          <p className="text-sm text-blue-900">{mainSuggestion}</p>
        </section>
      )}

      {/* 최근 면접 기록 */}
      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-base font-semibold">최근 면접 기록</h2>

        {!hasInterview ? (
          <p className="text-sm text-gray-500">
            최근 면접 기록이 없습니다. 면접을 진행하면 이곳에 요약이 표시됩니다.
          </p>
        ) : (
          <ul className="space-y-2 text-sm">
            {recentInterviews.map((iv) => (
              <li
                key={iv.id}
                className="flex flex-col gap-1 rounded-md border border-gray-100 bg-gray-50 px-3 py-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {iv.createdAt.toLocaleDateString("ko-KR")}{" "}
                    {formatToKorean12Hour(iv.createdAt)}
                  </span>
                  <span className="text-xs font-semibold text-sky-700">
                    {iv.totalScore}점 ({iv.grade})
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-700">
                  <span className="font-medium">{iv.category}</span>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5">
                    난이도 {iv.difficulty}
                  </span>
                  <span className="rounded-full bg-teal-100 px-2 py-0.5">
                    연습 시간 {formatTime(iv.timeSpend)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default ProfilePage;
