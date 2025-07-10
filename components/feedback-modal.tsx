import { useChatFeedbackStore } from "@/lib/store";
import {
  HiXMark,
  HiOutlineLightBulb,
  HiCheck,
  HiOutlineHandThumbUp,
  HiOutlineHandThumbDown,
} from "react-icons/hi2";

export const FeedbackModal = () => {
  const {
    text,
    role,
    questionIntend,
    answerTips,
    wells,
    improves,
    improvement,
    resetChatFeedback,
  } = useChatFeedbackStore();

  const onClick = () => {
    resetChatFeedback();
  };

  return (
    <div className="absolute top-0 left-0 flex justify-end w-screen h-screen bg-black/50">
      <div className="flex flex-col h-full max-w-sm gap-6 p-6 bg-white">
        <div className="flex items-center justify-between">
          <span className="text-lg">
            {role === "interviewer" ? "질문 의도" : "답변 피드백"}
          </span>
          <div
            onClick={onClick}
            className="p-2 rounded-lg cursor-pointer hover:bg-gray-300"
          >
            <HiXMark className="text-xl" />
          </div>
        </div>
        <div>
          <span className="text-sm text-gray-500">
            {role === "interviewer"
              ? "면접관이 이 질문을 통해 알고자 하는 것"
              : "답변에 대한 평가 및 개선점"}
          </span>
        </div>
        <div className="flex flex-col gap-3 p-4 rounded-lg bg-background border-1 border-primary">
          {role === "interviewer" ? (
            <div className="flex items-center gap-2 text-primary">
              <HiOutlineLightBulb />
              <span>질문</span>
            </div>
          ) : (
            <p className="text-primary">내 답변</p>
          )}
          <span>{text}</span>
        </div>
        {role === "interviewer" ? (
          <div className="flex flex-col gap-4">
            <p>질문 의도</p>
            <p className="text-sm text-gray-500">{questionIntend}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-[#1E8545]">
                <HiOutlineHandThumbUp />
                <span>잘한 점</span>
              </div>
              <div className="flex flex-col gap-2">
                {wells?.split("/").map((well, index) => (
                  <div key={index} className="flex gap-2 text-sm text-gray-500">
                    <HiCheck />
                    <span>{well}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-[#B91C1C]">
                <HiOutlineHandThumbDown />
                <span>개선할 점</span>
              </div>
              <div className="flex flex-col gap-2">
                {improves?.split("/").map((improve, index) => (
                  <div key={index} className="flex gap-2 text-sm text-gray-500">
                    <HiCheck />
                    <span>{improve}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-col gap-4">
          <p>{role === "interviewer" ? "답변 팁" : "개선 방안"}</p>
          {role === "interviewer" ? (
            <div className="flex flex-col gap-2">
              {answerTips?.split("/").map((tip, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm text-gray-500"
                >
                  <HiCheck />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-sm text-gray-500">{improvement}</span>
          )}
        </div>
      </div>
    </div>
  );
};
