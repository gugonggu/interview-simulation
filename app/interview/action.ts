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
    model: "gpt-4o-mini",
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
    model: "gpt-4o-mini",
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
      content: `너는 프로페셔널한 면접관이다. 아래 대화 히스토리를 바탕으로 면접을 평가하고 피드백을 제공하라. 피드백은 한글로 작성하라. 필요없는 텍스트는 /를 제외하고 넣지 말고 피드백 형식은 다음과 같다 총 점수는 0점과 100점 사이에서 평가하라 총점수/기술역량/인성및태도/의사소통/문제해결/강점1/강점2/강점3/개선할점1/개선할점2/개선할점3/개선방안1/개선방안2/개선방안3 답변 예시는 다음과 같다 78점/82점/75점/80점/74점/기술적 지식이 풍부하고 구체적인 예시를 잘 활용함/자신의 경험을 논리적으로 설명하는 능력이 뛰어남/질문의 의도를 정확히 파악하고 적절한 답변을 제시함/답변이 다소 길어져 핵심이 흐려지는 경우가 있음/스트레스 상황에서의 대처 방안이 구체적이지 않음/팀워크 관련 경험 설명에서 개인의 역할이 명확하지 않음/STAR 기법을 활용하여 답변을 더 구조화하세요/핵심 메시지를 먼저 전달할 후 부연 설명을 추가하세요/구체적인 수치나 결과를 포함하여 답변의 신뢰성을 높이세요`,
    },
    ...formattedHistory,
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
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
    select: {
      id: true,
    },
  });

  const feedback = await evalInterview({ chatHistory });
  const formattedFeedback = feedback!.split("/");

  const interview = await db.interview.create({
    data: {
      userId: user?.id,
      category,
      questionType: questionType.join("/"),
      difficulty,
      totalScore: formattedFeedback?.[0],
      grade: getGradeFromScore(formattedFeedback?.[0]),
      timeSpend,
      techScore: formattedFeedback?.[1],
      softScore: formattedFeedback?.[2],
      communicationScore: formattedFeedback?.[3],
      problemSolvingScore: formattedFeedback?.[4],
      wells: formattedFeedback.slice(5, 8).join("/"),
      improves: formattedFeedback.slice(8, 11).join("/"),
      improvement: formattedFeedback.slice(11, 14).join("/"),
    },
    select: {
      id: true,
    },
  });

  for (let i = 0; i < chatHistory.length; i++) {
    const chat = chatHistory[i];
    await db.chat.create({
      data: {
        userId: user?.id,
        text: chat.text,
        role: chat.role,
        time: chat.time,
        isFeedbackable: chat.isFeedbackable,
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
  return null;
};
