"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { getGradeFromScore } from "@/lib/utils";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_APIKEY,
});

interface Chat {
  text: string;
  role: "interviewer" | "interviewee";
  time: Date;
  isFeedbackable?: boolean;
  questionIntend?: string;
  answerTips?: string;
  wells?: string;
  improves?: string;
  improvement?: string;
  totalEvaluation?: string;
  totalScore?: string;
  questionType?: string;
}

interface GenerateQuestionsParams {
  category: string;
  questionType: string[];
  difficulty: string;
  chatHistory: Chat[];
}

interface GenerateAnswerFeedbackParams {
  question: string;
  answer: string;
}

interface evalInterviewParams {
  chatHistory: Chat[];
}

interface SaveInterviewParams {
  category: string;
  questionType: string[];
  difficulty: string;
  timeSpend: number;
  chatHistory: Chat[];
}

export const generateQuestions = async ({
  category,
  questionType,
  difficulty,
  chatHistory,
}: GenerateQuestionsParams) => {
  const questionTypeString = questionType.join(", ");

  const formattedHistory: ChatCompletionMessageParam[] = chatHistory.map(
    (item) => ({
      role: item.role === "interviewer" ? "user" : "assistant",
      content: item.text,
    })
  );

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `너는 프로페셔널한 면접관이다. 면접 직무는 ${category}이고, 질문 유형은 ${questionTypeString}이며, 면접 난이도는 ${difficulty}이다. 아래 대화 히스토리를 바탕으로 다음 질문을 하나 만들어라. 한 번에 한 가지 구체적이고 심화된 질문만 해라. 답변은 한국어로 작성해라. 필요없는 텍스트는 /를 제외하고 넣지 말고 답변 형식은 다음과 같다. 질문/질문의도/답변팁1/답변팁2/답변팁3/질문유형 답변 예시는 다음과 같다. 자기소개 부탁드립니다./지원자의 배경과 성격, 커뮤니케이션 능력을 파악하기 위한 기본적인 질문입니다. 간결하면서도 자신의 강점을 어필할 수 있는 답변을 기대합니다./구체적인 경험과 사례를 들어 설명하세요./STAR 기법(상황-임무-행동-결과)을 활용하면 효과적입니다./답변은 2-3분 내로 간결하게 마무리하세요./인성 질문`,
    },
    ...formattedHistory,
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
  });

  const question = completion.choices[0].message.content?.trim();
  return question;
};

export const generateAnswerFeedback = async ({
  question,
  answer,
}: GenerateAnswerFeedbackParams) => {
  const formattedHistory: ChatCompletionMessageParam[] = [
    {
      role: "assistant",
      content: question,
    },
    {
      role: "user",
      content: answer,
    },
  ];

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `너는 프로페셔널한 면접관이다. 아래 질문에 대한 답변을 평가하고 피드백을 제공해라. 피드백은 한글로 작성해라. 필요없는 텍스트는 /를 제외하고 넣지 말고 피드백 형식은 다음과 같다. 잘한점1/잘한점2/개선할점1/개선할점2/개선방안. 답변 예시는 다음과 같다. 자신의 경험을 구체적으로 언급했습니다./관련 기술에 대한 이해도가 잘 드러납니다./답변이 다소 길어 핵심이 흐려질 수 있습니다./기술적 용어 사용이 불명확한 부분이 있습니다./핵심 내용을 먼저 간결하게 전달한 후 상세 설명을 덧붙이면 더 효과적인 답변이 될 것입니다. 또한 기술 용어를 정확하게 사용하여 전문성을 더 잘 어필할 수 있습니다.`,
    },
    ...formattedHistory,
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
  });

  const feedback = completion.choices[0].message.content?.trim();
  return feedback;
};

const evalInterview = async ({ chatHistory }: evalInterviewParams) => {
  const formattedHistory: ChatCompletionMessageParam[] = chatHistory.map(
    (chat) => ({
      role: chat.role === "interviewer" ? "user" : "assistant",
      content: chat.text,
    })
  );

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `
        너는 프로페셔널한 면접관이다.
            
        [출력 형식 규칙]
        - 반드시 하나의 줄로만 출력한다.
        - 줄바꿈(\n), 공백, 불릿, 설명 문장을 추가하지 않는다.
        - 아래 항목 15개를 정확히 이 순서로 '/'로만 구분해서 출력한다.
        - 항목 개수는 정확히 15개여야 한다.
            
        [필드 목록 및 순서]
        1) 총점수 (예: "78점")
        2) 기술역량 점수 (예: "82점")
        3) 인성및태도 점수
        4) 의사소통 점수
        5) 문제해결 점수
        6) 강점1
        7) 강점2
        8) 강점3
        9) 개선할점1
        10) 개선할점2
        11) 개선할점3
        12) 개선방안1
        13) 개선방안2
        14) 개선방안3
        15) 한 줄 총평 (선택적이지만 비워두지 말 것)
            
        [출력 예시]
        78점/82점/75점/80점/74점/기술적 지식이 풍부하고 구체적인 예시를 잘 활용함/자신의 경험을 논리적으로 설명하는 능력이 뛰어남/질문의 의도를 정확히 파악함/답변이 다소 길어져 핵심이 흐려지는 경우가 있음/스트레스 상황에서의 대처 방안이 구체적이지 않음/팀워크 경험에서 개인 역할이 명확하지 않음/STAR 기법을 활용하여 답변을 더 구조화하세요/핵심 메시지를 먼저 전달한 후 부연 설명을 추가하세요/구체적인 수치나 결과를 포함하여 답변의 신뢰성을 높이세요/전체적으로 잠재력이 높은 지원자이며 몇 가지 구조화된 답변 연습이 필요합니다.
            
        위 규칙을 반드시 지켜라.
        규칙을 어기면 평가에 실패한 것으로 간주되니 절대로 다른 형식(문단, 불릿, JSON 등)을 사용하지 마라.
        `,
    },
    ...formattedHistory,
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
  });

  const feedback = completion.choices[0].message.content?.trim();
  return feedback;
};

export const saveInterview = async ({
  category,
  questionType,
  difficulty,
  timeSpend,
  chatHistory,
}: SaveInterviewParams) => {
  const { id } = await getSession();
  if (!id) return;

  const user = await db.user.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!user) return;

  const feedback = await evalInterview({ chatHistory });
  if (!feedback) {
    // 최소한 여기서 한 번 막아두는 게 좋음
    throw new Error("면접 평가 결과를 생성하지 못했습니다.");
  }

  const formattedFeedback = feedback.split("/").map((s) => s.trim());

  // 안전장치: 기대하는 길이 안 나오면 기본값 채우기
  const safe = (idx: number, fallback = "") =>
    formattedFeedback[idx] ?? fallback;

  const totalScoreRaw = safe(0, "0"); // "78점" 이런 식으로 올 수도 있음
  const totalScoreNumber = parseInt(totalScoreRaw.replace(/[^0-9]/g, ""), 10);

  const interview = await db.interview.create({
    data: {
      userId: user.id,
      category,
      questionType: questionType.join("/"),
      difficulty,
      totalScore: totalScoreRaw, // 혹은 totalScoreNumber.toString()
      grade: getGradeFromScore(totalScoreNumber.toString()),
      timeSpend,

      // 점수 필드들: 최소한 빈 문자열이라도 보장
      techScore: safe(1, "0"),
      softScore: safe(2, "0"),
      communicationScore: safe(3, "0"),
      problemSolvingScore: safe(4, "0"),

      // 텍스트 피드백
      wells: formattedFeedback.slice(5, 8).join("/") || "",
      improves: formattedFeedback.slice(8, 11).join("/") || "",
      improvement: formattedFeedback.slice(11, 14).join("/") || "",
    },
    select: { id: true },
  });

  for (const chat of chatHistory) {
    await db.chat.create({
      data: {
        userId: user.id,
        text: chat.text,
        role: chat.role,
        time: chat.time,
        isFeedbackable: chat.isFeedbackable ?? false,
        questionIntend: chat.questionIntend,
        answerTips: chat.answerTips,
        wells: chat.wells,
        improves: chat.improves,
        improvement: chat.improvement,
        interviewId: interview.id,
        questionType: chat.questionType,
      },
    });
  }

  return interview.id;
};
