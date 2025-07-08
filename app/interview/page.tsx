"use client";

import { generateQuestions } from "@/app/interview/action";
import { FeedbackModal } from "@/components/feedback-modal";
import { useChatFeedbackStore, useSettingsStore } from "@/lib/store";
import { formatTime, formatToKorean12Hour } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import {
  HiArrowLeft,
  HiOutlineChatBubbleLeftRight,
  HiOutlineClock,
  HiOutlineInformationCircle,
  HiOutlinePaperAirplane,
  HiOutlineLightBulb,
} from "react-icons/hi2";

interface InputBarProps {
  answer: string;
  setAnswer: React.Dispatch<React.SetStateAction<string>>;
}

interface ChatProps {
  text: string;
  role: "interviewer" | "interviewee";
  time: Date;
  isFeedbackable?: boolean;
  questionIntend?: string;
  answerTips?: string[];
  wells?: string[];
  improves?: string[];
  improvement?: string;
}

const Timer = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [seconds]);

  return (
    <div className="flex items-center gap-2">
      <HiOutlineClock />
      <span>{formatTime(seconds)}</span>
    </div>
  );
};

const Header = () => {
  const { category, questionType, difficulty } = useSettingsStore();
  const router = useRouter();

  const onClick = () => {
    router.back();
  };

  return (
    <header className="flex flex-col gap-5 px-6 py-4 bg-white border-gray-300 border-b-1">
      <div className="flex items-center justify-between">
        <button
          onClick={onClick}
          className="flex items-center gap-4 text-xl cursor-pointer"
        >
          <HiArrowLeft />
          <HiOutlineChatBubbleLeftRight className="text-2xl text-primary" />
          <span>면접 진행 중</span>
        </button>
        <Timer />
      </div>
      <div className="flex items-center gap-2 text-sm">
        <div className="sm-bubble bg-background text-primary">{category}</div>
        {questionType.map((type) => (
          <div key={type} className="sm-bubble bg-[#FFFBEB] text-[#92400E]">
            {type}
          </div>
        ))}
        <div
          className={`sm-bubble ${
            difficulty === "일반 면접"
              ? "bg-[#F0FDF4] text-[#15803D]"
              : "bg-[#FEF2F2]"
          }`}
        >
          {difficulty}
        </div>
      </div>
    </header>
  );
};

const Chat = ({
  text,
  role,
  time,
  isFeedbackable,
  questionIntend,
  answerTips,
  wells,
  improves,
  improvement,
}: ChatProps) => {
  const { setChatFeedback } = useChatFeedbackStore();
  const onClick = () => {
    if (isFeedbackable) {
      setChatFeedback(
        text,
        role,
        time,
        isFeedbackable,
        questionIntend,
        answerTips,
        wells,
        improves,
        improvement
      );
    }
  };

  return (
    <div
      onClick={onClick}
      className={`max-w-1/2 p-4 border-gray-300 rounded-lg bordeinset-ring-pink-100 flex flex-col gap-2 w-fit ${
        isFeedbackable ? "hover:shadow-lg transition-all cursor-pointer" : ""
      } ${
        role === "interviewer"
          ? "self-start bg-white"
          : "self-end bg-primary text-white"
      }`}
    >
      <div
        className={`flex items-center justify-between text-sm ${
          role === "interviewer" ? "text-gray-500" : "text-white"
        }`}
      >
        <div className="flex items-center gap-1">
          {role === "interviewer" ? (
            <>
              <HiOutlineInformationCircle />
              <span>면접관</span>
            </>
          ) : (
            "나"
          )}
        </div>
        <span>{formatToKorean12Hour(time)}</span>
      </div>
      <div>{text}</div>
      {isFeedbackable ? (
        <div className="flex items-center gap-1 text-sm">
          <HiOutlineLightBulb />
          <span>자세히 보기</span>
        </div>
      ) : null}
    </div>
  );
};

const ChatRoom = () => {
  const chatHistory: ChatProps[] = [
    {
      text: "안녕하세요, 프론트엔드 직무 면접을 시작하겠습니다. 준비되셨나요?",
      role: "interviewer",
      time: new Date(),
      isFeedbackable: false,
    },
    {
      text: "자기소개 부탁드립니다.",
      role: "interviewer",
      time: new Date(),
      isFeedbackable: true,
      questionIntend:
        "지원자의 배경과 성격, 커뮤니케이션 능력을 파악하기 위한 기본적인 질문입니다. 간결하면서도 자신의 강점을 어필할 수 있는 답변을 기대합니다.",
      answerTips: [
        "구체적인 경험과 사례를 들어 설명하세요.",
        "STAR 기법(상황-임무-행동-결과)을 활용하면 효과적입니다.",
        "답변은 2-3분 내로 간결하게 마무리하세요.",
      ],
    },
    {
      text: "안녕하세요, 저는 프론트엔드 개발자 지원자입니다. HTML, CSS, JavaScript를 사용하여 웹 애플리케이션을 개발해왔습니다. 최근에는 React와 Next.js를 활용한 프로젝트에 집중하고 있습니다.",
      role: "interviewee",
      time: new Date(),
      isFeedbackable: true,
      wells: [
        "자신의 경험을 구체적으로 언급했습니다.",
        "관련 기술에 대한 이해도가 잘 드러납니다.",
      ],
      improves: [
        "답변이 다소 길어 핵심이 흐려질 수 있습니다.",
        "기술적 용어 사용이 불명확한 부분이 있습니다.",
      ],
      improvement:
        "핵심 내용을 먼저 간결하게 전달한 후 상세 설명을 덧붙이면 더 효과적인 답변이 될 것입니다. 또한 기술 용어를 정확하게 사용하여 전문성을 더 잘 어필할 수 있습니다.",
    },
  ];
  const { text } = useChatFeedbackStore();

  return (
    <>
      <div className="flex flex-col flex-grow gap-6 p-6 bg-background">
        {chatHistory.map((chat, index) => (
          <Chat
            key={index}
            text={chat.text}
            role={chat.role}
            time={chat.time}
            isFeedbackable={chat.isFeedbackable}
            questionIntend={chat.questionIntend}
            answerTips={chat.answerTips}
            wells={chat.wells}
            improves={chat.improves}
            improvement={chat.improvement}
          />
        ))}
      </div>
      {text ? <FeedbackModal /> : null}
    </>
  );
};

const InputBar = ({ answer, setAnswer }: InputBarProps) => {
  return (
    <div className="bg-white border-gray-300 border-t-1">
      <div className="flex items-center justify-center gap-3 p-4">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="답변을 입력하세요..."
          className="w-full p-3 border-gray-300 rounded-lg border-1"
        ></input>
        <button className="bg-[#8FAFF5] rounded-lg p-3">
          <HiOutlinePaperAirplane />
        </button>
      </div>
    </div>
  );
};

const Interview = () => {
  const [answer, setAnswer] = useState("");

  return (
    <div className="absolute top-0 left-0 flex flex-col justify-between w-full h-screen">
      <Header />
      <ChatRoom />
      <InputBar answer={answer} setAnswer={setAnswer} />
    </div>
  );
};
export default Interview;
