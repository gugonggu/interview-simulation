import { notFound, redirect } from "next/navigation";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToKorean12Hour } from "@/lib/utils";

interface ReviewPageProps {
  params: {
    id: string;
  };
}

const InterviewReviewPage = async ({ params }: ReviewPageProps) => {
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
    where: { interviewId: interview.id },
    orderBy: { time: "asc" },
  });

  type QAItem = {
    id: number;
    question: string | null;
    time: Date;
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
        time: chat.time,
      });
    }
  }

  const createdAt = interview.createdAt as Date;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-6 border-b border-gray-200 pb-4">
        <p className="text-xs text-gray-500">
          {createdAt.toLocaleDateString("ko-KR")}{" "}
          {formatToKorean12Hour(createdAt)} 진행한 면접
        </p>
        <h1 className="mt-1 text-2xl font-semibold">
          {interview.category} 답변 복습 모드
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          아래 질문들에 대해, 이전 답변을 떠올리며 새로운 답변을 적어보세요. 이
          페이지에서 작성한 내용은 서버에 저장되지 않으며, 오직 자기
          연습용입니다.
        </p>
      </header>

      {qaItems.length === 0 ? (
        <p className="text-sm text-gray-500">
          복습할 수 있는 질문이 없습니다. 면접 진행 시 피드백이 생성된 질문에
          한해 복습 모드가 제공됩니다.
        </p>
      ) : (
        <ol className="space-y-6">
          {qaItems.map((item, index) => (
            <li
              key={item.id}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">
                  Q{index + 1}
                </span>
                <span className="text-[11px] text-gray-400">
                  {formatToKorean12Hour(item.time)}
                </span>
              </div>
              {item.question && (
                <p className="mb-3 text-sm font-medium text-gray-900">
                  {item.question}
                </p>
              )}
              <label className="block text-xs font-semibold text-gray-700">
                나만의 새로운 답변
              </label>
              <textarea
                className="mt-1 w-full min-h-[120px] rounded-md border border-gray-200 p-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="이 질문을 다시 받았다고 생각하고, 새로운 답변을 자유롭게 적어보세요."
              />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default InterviewReviewPage;
