"use server";

import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_APIKEY,
});

interface GenerateQuestionsParams {
  category: string;
  questionType: string[];
  difficulty: string;
  chatHistory: {
    text: string;
    role: "interviewer" | "interviewee";
    time: Date;
    isFeedbackable?: boolean;
    questionIntend?: string;
    answerTips?: string[];
    wells?: string[];
    improves?: string[];
    improvement?: string;
  }[];
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
      content: `너는 프로페셔널한 면접관이다. 면접 직무는 ${category}이고, 질문 유형은 ${questionTypeString}이며, 면접 난이도는 ${difficulty}이다. 아래 대화 히스토리를 바탕으로 다음 질문을 하나 만들어라. 한 번에 한 가지 구체적이고 심화된 질문만 해라. 답변은 한국어로 작성해라. 답변 형식은 다음과 같다. 질문/질문의도/답변팁1/답변팁2/답변팁3`,
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

export const generateAnswerFeedback = async () => {};
