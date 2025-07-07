"use client";

import GoBack from "@/components/go-back";
import PrevStage from "@/components/prev-stage";
import ProgressBar from "@/components/progress-bar";
import { useSettingsStore } from "@/lib/store";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import { HiOutlineBriefcase, HiOutlineCheckCircle } from "react-icons/hi2";

interface TextInputProps {
  category: string;
  setCategory: (category: string) => void;
}

interface PopularCategoryProps {
  setCategory: (category: string) => void;
}

const TextInput = ({ category, setCategory }: TextInputProps) => {
  return (
    <input
      type="text"
      value={category}
      onChange={(e) => setCategory(e.target.value.trim())}
      placeholder="예: 프론트엔드 개발자, 마케팅 매니저"
      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
    />
  );
};

const PopularCategories = ({ setCategory }: PopularCategoryProps) => {
  return (
    <div>
      <h3 className="text-lg">인기 직무</h3>
      <div className="flex flex-wrap gap-2 mt-2">
        {[
          "프론트엔드 개발자",
          "백엔드 개발자",
          "풀스택 개발자",
          "모바일 개발자",
          "데이터 분석가",
          "UI/UX 디자이너",
        ].map((category) => (
          <span
            key={category}
            className="px-3 py-1 text-sm bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200"
            onClick={() => setCategory(category)}
          >
            {category}
          </span>
        ))}
      </div>
    </div>
  );
};

const Tip = () => {
  return (
    <div className="bg-[#EFF6FF] text-primary text-sm p-2">
      💡 구체적인 직무명을 입력하면 더 정확한 면접 질문을 받을 수 있어요
    </div>
  );
};

const SetCategoryComponent = () => {
  const { category, setCategory } = useSettingsStore();

  return (
    <>
      <div className="flex items-center gap-2">
        <HiOutlineBriefcase className="text-2xl text-primary" />
        <span className="text-xl">직무를 입력해주세요</span>
      </div>
      <span className="text-gray-500">어떤 분야의 면접을 준비하시나요?</span>
      <TextInput category={category} setCategory={setCategory} />
      <PopularCategories setCategory={setCategory} />
      <Tip />
    </>
  );
};

const SetQuestionTypeComponent = () => {
  const types = [
    {
      title: "기술 질문",
      description: "전문 기술과 관련된 질문",
    },
    {
      title: "인성 질문",
      description: "성격과 가치관에 대한 질문",
    },
    {
      title: "경험 질문",
      description: "과거 경험과 프로젝트에 대한 질문",
    },
    {
      title: "상황 질문",
      description: "특정 상황에서의 대처 방법",
    },
  ];

  const { questionType, addQuestionType, removeQuestionType } =
    useSettingsStore();

  return (
    <div className="flex flex-col items-center w-full gap-2">
      <span className="text-xl">질문 유형을 선택해주세요</span>
      <span className="text-gray-500 text-md">여러 개를 선택할 수 있어요</span>
      {types.map((type) => (
        <button
          onClick={
            questionType.includes(type.title)
              ? () => removeQuestionType(type.title)
              : () => addQuestionType(type.title)
          }
          key={type.title}
          className={`flex items-center justify-between w-full gap-4 p-4 rounded-lg cursor-pointer hover:bg-gray-50 hover:shadow-lg transition-all ${
            questionType.includes(type.title)
              ? "bg-[#EFF6FF] border-primary border-2"
              : "bg-white border-gray-300 border-1"
          }`}
        >
          <div className="flex flex-col items-start">
            <span>{type.title}</span>
            <span className="text-gray-400">{type.description}</span>
          </div>
          {questionType.includes(type.title) ? (
            <HiOutlineCheckCircle className="size-6 text-primary" />
          ) : null}
        </button>
      ))}
    </div>
  );
};

const SetDifficultyComponent = () => {
  const { difficulty, setDifficulty } = useSettingsStore();

  return (
    <div className="flex flex-col items-center w-full gap-6">
      <div className="flex flex-col items-center w-full gap-2">
        <span className="text-xl">난이도를 선택해주세요</span>
        <span className="text-gray-500">어떤 스타일의 면접을 원하시나요?</span>
      </div>
      <button
        onClick={() => setDifficulty("일반 면접")}
        className={`flex items-center justify-between w-full gap-4 p-4 rounded-lg border-1 cursor-pointer ${
          difficulty === "일반 면접"
            ? "bg-background border-primary"
            : "bg-[#F0FDF4] border-[#BBF7D0]"
        }`}
      >
        <div className="flex flex-col items-start gap-4">
          <span className="text-lg">일반 면접</span>
          <span className="text-gray-500">
            편안한 분위기에서 진행되는 일반적인 면접
          </span>
        </div>
        {difficulty === "일반 면접" && (
          <HiOutlineCheckCircle className="size-6 text-primary" />
        )}
      </button>
      <button
        onClick={() => setDifficulty("압박 면접")}
        className={`flex items-center justify-between w-full gap-4 p-4 rounded-lg border-1 cursor-pointer ${
          difficulty === "압박 면접"
            ? "bg-background border-primary"
            : "bg-[#FEF2F2] border-[#FECACA]"
        }`}
      >
        <div className="flex flex-col items-start gap-4">
          <span className="text-lg">압박 면접</span>
          <span className="text-gray-500">
            긴장감 있는 분위기에서 진행되는 압박 면접
          </span>
        </div>
        {difficulty === "압박 면접" && (
          <HiOutlineCheckCircle className="size-6 text-primary" />
        )}
      </button>
    </div>
  );
};

const Bubble = ({ text }: { text: string }) => {
  return (
    <span className="bg-[#F4F4F5] rounded-full py-1 px-2 whitespace-nowrap">
      {text}
    </span>
  );
};

const Summary = () => {
  const { category, questionType, difficulty } = useSettingsStore();

  return (
    <div className="flex flex-col gap-6 p-8 mx-24 bg-[#FFFBEB] rounded-lg shadow-lg">
      <p className="text-lg text-[#92400E]">설정 요약</p>
      <div className="flex flex-col gap-4 text-sm">
        <div className="flex gap-4">
          <span className="text-[#92400E]">직무: </span>
          <Bubble text={category} />
        </div>
        <div className="flex gap-4">
          <span className="text-[#92400E]">질문 유형: </span>
          {questionType.map((type) => (
            <Bubble text={type} key={type} />
          ))}
        </div>
        {difficulty && (
          <div className="flex gap-4">
            <span className="text-[#92400E]">난이도: </span>
            <Bubble text={difficulty} />
          </div>
        )}
      </div>
    </div>
  );
};

const Setting = () => {
  const [stage, setStage] = useState<number>(1);

  const onClick = () => {
    if (stage !== 3) {
      setStage((prev) => prev + 1);
    } else {
      redirect("/interview");
    }
  };

  return (
    <div className="flex flex-col gap-12">
      {stage === 1 ? <GoBack /> : <PrevStage setStage={setStage} />}
      <div>
        <ProgressBar stage={stage} />
        <div className="items-center my-0 form">
          {stage === 1 ? (
            <SetCategoryComponent />
          ) : stage < 3 ? (
            <SetQuestionTypeComponent />
          ) : (
            <SetDifficultyComponent />
          )}
        </div>
      </div>
      {stage === 3 && <Summary />}
      <button className="primary-button" onClick={onClick}>
        {stage === 3 ? "면접 시작하기" : "다음"}
      </button>
    </div>
  );
};
export default Setting;
