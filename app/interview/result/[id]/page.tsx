// app/interview/result/[id]/page.tsx

import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatTime, formatToKorean12Hour } from "@/lib/utils";

interface ResultPageProps {
  params: {
    id: string;
  };
}

const InterviewResultPage = async ({ params }: ResultPageProps) => {
  const session = await getSession();

  if (!session.id) {
    redirect("/login");
  }

  const interview = await db.interview.findUnique({
    where: { id: params.id },
  });

  if (!interview) {
    notFound();
  }

  if (interview.userId !== session.id) {
    redirect("/history");
  }

  const chats = await db.chat.findMany({
    where: {
      interviewId: interview.id,
    },
    orderBy: { time: "asc" },
  });

  type QAItem = {
    id: number;
    question: string | null;
    answer: string;
    time: Date;
    wells?: string[];
    improves?: string[];
    improvement?: string[];
    questionIntend?: string | null;
    answerTips?: string | null;
  };

  const qaItems: QAItem[] = [];
  let lastQuestion: string | null = null;

  for (const chat of chats) {
    if (chat.role === "interviewer") {
      lastQuestion = chat.text;
    }

    if (chat.role === "interviewee" && chat.isFeedbackable) {
      qaItems.push({
        id: chat.id,
        question: lastQuestion,
        answer: chat.text,
        time: chat.time,
        wells: chat.wells ? chat.wells.split("/").filter((w) => w.trim()) : [],
        improves: chat.improves
          ? chat.improves.split("/").filter((w) => w.trim())
          : [],
        improvement: chat.improvement
          ? chat.improvement.split("/").filter((w) => w.trim())
          : [],
        questionIntend: chat.questionIntend,
        answerTips: chat.answerTips,
      });
    }
  }

  const createdAt = interview.createdAt as Date;
  const interviewWells = interview.wells
    ? interview.wells.split("/").filter((w) => w.trim())
    : [];
  const interviewImproves = interview.improves
    ? interview.improves.split("/").filter((w) => w.trim())
    : [];
  const interviewImprovements = interview.improvement
    ? interview.improvement.split("/").filter((w) => w.trim())
    : [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* 상단 헤더 */}
      <header className="mb-6 border-b border-gray-200 pb-4">
        <p className="text-xs text-gray-500">
          {createdAt.toLocaleDateString("ko-KR")}{" "}
          {formatToKorean12Hour(createdAt)}
        </p>
        <div className="mt-1 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">
            {interview.category} 모의 면접 결과
          </h1>
          <Link
            href="/history"
            className="text-xs text-gray-500 underline hover:text-gray-700"
          >
            히스토리로 돌아가기
          </Link>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
            난이도 {interview.difficulty}
          </span>
          <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
            총점 {interview.totalScore} / 등급 {interview.grade}
          </span>
          <span className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-xs text-teal-700">
            소요 시간 {formatTime(interview.timeSpend)}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
          <span>기술 역량 {interview.techScore}</span>
          <span>· 소프트 스킬 {interview.softScore}</span>
          <span>· 커뮤니케이션 {interview.communicationScore}</span>
          <span>· 문제 해결 {interview.problemSolvingScore}</span>
        </div>

        {/* 복습 모드로 이동 버튼 */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/interview/review/${interview.id}`}
            className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary/90"
          >
            이 질문들로 다시 연습하기
          </Link>
        </div>
      </header>

      {/* 전체 총평 */}
      <section className="mb-8 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-base font-semibold">전체 총평</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <h3 className="mb-1 text-xs font-semibold text-green-700">
              잘한 점
            </h3>
            {interviewWells.length ? (
              <ul className="space-y-1 text-xs text-gray-700">
                {interviewWells.map((w, idx) => (
                  <li key={idx}>• {w}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-400">기록된 내용이 없습니다.</p>
            )}
          </div>
          <div>
            <h3 className="mb-1 text-xs font-semibold text-amber-700">
              아쉬운 점
            </h3>
            {interviewImproves.length ? (
              <ul className="space-y-1 text-xs text-gray-700">
                {interviewImproves.map((w, idx) => (
                  <li key={idx}>• {w}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-400">기록된 내용이 없습니다.</p>
            )}
          </div>
          <div>
            <h3 className="mb-1 text-xs font-semibold text-sky-700">
              개선 방향
            </h3>
            {interviewImprovements.length ? (
              <ul className="space-y-1 text-xs text-gray-700">
                {interviewImprovements.map((w, idx) => (
                  <li key={idx}>• {w}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-400">기록된 내용이 없습니다.</p>
            )}
          </div>
        </div>
      </section>

      {/* 질문별 상세 피드백 */}
      <section>
        <h2 className="mb-3 text-base font-semibold">질문별 상세 피드백</h2>

        {qaItems.length === 0 ? (
          <p className="text-sm text-gray-500">
            저장된 질문별 피드백이 없습니다. 면접 진행 시 피드백 생성을 먼저
            수행해야 합니다.
          </p>
        ) : (
          <ol className="space-y-4">
            {qaItems.map((item, index) => (
              <li
                key={item.id}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500">
                    Q{index + 1}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {formatToKorean12Hour(item.time)}
                  </span>
                </div>

                {item.question && (
                  <div className="mb-2">
                    <p className="text-xs font-semibold text-gray-700">질문</p>
                    <p className="text-sm text-gray-900">{item.question}</p>
                  </div>
                )}

                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-700">
                    나의 답변
                  </p>
                  <p className="whitespace-pre-line text-sm text-gray-900">
                    {item.answer}
                  </p>
                </div>

                {(item.questionIntend || item.answerTips) && (
                  <div className="mb-3 grid gap-3 md:grid-cols-2">
                    {item.questionIntend && (
                      <div>
                        <p className="text-[11px] font-semibold text-indigo-700">
                          질문 의도
                        </p>
                        <p className="mt-1 text-xs text-gray-800">
                          {item.questionIntend}
                        </p>
                      </div>
                    )}
                    {item.answerTips && (
                      <div>
                        <p className="text-[11px] font-semibold text-emerald-700">
                          답변 팁
                        </p>
                        <p className="mt-1 text-xs text-gray-800">
                          {item.answerTips}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid gap-3 md:grid-cols-3">
                  <div>
                    <p className="text-[11px] font-semibold text-green-700">
                      잘한 점
                    </p>
                    {item.wells && item.wells.length > 0 ? (
                      <ul className="mt-1 space-y-1 text-xs text-gray-800">
                        {item.wells.map((w, idx) => (
                          <li key={idx}>• {w}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-1 text-[11px] text-gray-400">
                        기록된 내용이 없습니다.
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-amber-700">
                      아쉬운 점
                    </p>
                    {item.improves && item.improves.length > 0 ? (
                      <ul className="mt-1 space-y-1 text-xs text-gray-800">
                        {item.improves.map((w, idx) => (
                          <li key={idx}>• {w}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-1 text-[11px] text-gray-400">
                        기록된 내용이 없습니다.
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-sky-700">
                      개선 방향
                    </p>
                    {item.improvement && item.improvement.length > 0 ? (
                      <ul className="mt-1 space-y-1 text-xs text-gray-800">
                        {item.improvement.map((w, idx) => (
                          <li key={idx}>• {w}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-1 text-[11px] text-gray-400">
                        기록된 내용이 없습니다.
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
};

export default InterviewResultPage;
