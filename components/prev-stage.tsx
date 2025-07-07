import React from "react";
import { HiArrowLeft, HiOutlineChatBubbleLeftRight } from "react-icons/hi2";

interface PrevStageProps {
  setStage: React.Dispatch<React.SetStateAction<number>>;
}

const PrevStage = ({ setStage }: PrevStageProps) => {
  return (
    <button
      onClick={() => setStage((prev) => prev - 1)}
      className="flex items-center gap-4 text-2xl cursor-pointer"
    >
      <HiArrowLeft className="text-black" />
      <HiOutlineChatBubbleLeftRight className="text-primary" />
      <span className="text-black">면접 설정</span>
    </button>
  );
};
export default PrevStage;
