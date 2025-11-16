// app/(auth)/history/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatTime, formatToKorean12Hour } from "@/lib/utils";

const parseScore = (scoreStr: string) => {
  const num = parseInt(scoreStr.replace(/[^0-9]/g, ""), 10);
  return Number.isNaN(num) ? 0 : num;
};

interface HistoryPageProps {
  searchParams?: {
    sort?: string;
  };
}

const HistoryPage = async ({ searchParams }: HistoryPageProps) => {
  const { id } = await getSession();

  if (!id) {
    redirect("/login");
  }

  const rawInterviews = await db.interview.findMany({
    where: { userId: id! },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!rawInterviews.length) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-3xl flex-col items-center justify-center px-4">
        <h1 className="mb-2 text-xl font-semibold">면접 히스토리</h1>
        <p className="mb-6 text-sm text-gray-500">
          아직 저장된 면접 기록이 없습니다. 첫 면접을 진행해보세요!
        </p>
        <Link
          href="/interview/settings"
          className="rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600"
        >
          면접 시작하러 가기
        </Link>
      </div>
    );
  }

  const sort = searchParams?.sort ?? "date-desc";

  const interviews = [...rawInterviews];

  if (sort === "date-asc") {
    interviews.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  } else if (sort === "score-desc") {
    interviews.sort(
      (a, b) => parseScore(b.totalScore) - parseScore(a.totalScore)
    );
  }
  // date-desc는 기본 orderBy 결과 그대로 사용

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">면접 히스토리</h1>
          <p className="mt-1 text-sm text-gray-500">
            지금까지 진행한 모의 면접 기록을 한눈에 확인하고, 결과를 자세히
            복기할 수 있습니다.
          </p>
        </div>

        <form className="text-xs" action="/history">
          <label className="mr-1 text-gray-500" htmlFor="sort">
            정렬
          </label>
          <select
            id="sort"
            name="sort"
            defaultValue={sort}
            className="rounded border border-gray-200 bg-white px-2 py-1 text-xs"
          >
            <option value="date-desc">최신순</option>
            <option value="date-asc">오래된 순</option>
            <option value="score-desc">점수 높은 순</option>
          </select>
        </form>
      </header>

      <div className="space-y-3">
        {interviews.map((interview) => {
          const createdAt = interview.createdAt as Date;
          const questionTypes = interview.questionType
            ? interview.questionType.split("/").filter((q) => q.trim().length)
            : [];

          return (
            <Link
              key={interview.id}
              href={`/interview/result/${interview.id}`}
              className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:border-sky-400 hover:bg-sky-50"
            >
              {/* 상단: 날짜 / 점수 */}
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {createdAt.toLocaleDateString("ko-KR")}{" "}
                  {formatToKorean12Hour(createdAt)}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700">
                  {interview.grade}{" "}
                  <span className="text-[11px] text-sky-600">
                    ({interview.totalScore})
                  </span>
                </span>
              </div>

              {/* 중간: 직무 / 난이도 / 질문 유형 */}
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  {interview.category}
                </span>

                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">
                  난이도 {interview.difficulty}
                </span>

                {questionTypes.map((qt) => (
                  <span
                    key={qt}
                    className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] text-indigo-600"
                  >
                    {qt}
                  </span>
                ))}
              </div>

              {/* 하단: 시간 / 세부 점수 */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-500">
                <span>소요 시간 {formatTime(interview.timeSpend)}</span>
                <span>기술 역량 {interview.techScore}</span>
                <span>소프트 스킬 {interview.softScore}</span>
                <span>커뮤니케이션 {interview.communicationScore}</span>
                <span>문제 해결 {interview.problemSolvingScore}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryPage;
