import Image from "next/image";
import logo from "../public/logo.png";
import logo_sm from "../public/logo_sm.png";
import { HiOutlineChatBubbleLeftRight, HiOutlineUsers } from "react-icons/hi2";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col justify-between h-full page-y-padding">
      <div className="flex flex-col items-center justify-center gap-4">
        <Image src={logo} alt="로고" className="w-auto mx-auto max-h-28" />
        <span className="text-lg text-gray-400">
          AI와 함께하는 스마트한 면접 연습
        </span>
      </div>
      <div className="flex flex-col items-center justify-center gap-4 p-8 bg-white rounded-lg shadow-2xl">
        <Image src={logo_sm} alt="작은 로고" className="w-auto max-h-24" />
        <span className="text-3xl font-semibold">
          면접 준비, 이제 혼자가 아니에요
        </span>
        <span className="text-lg text-gray-400">
          AI 면접관과 실전 같은 연습을 통해 자신감을 키워보세요
        </span>
      </div>
      <div className="flex justify-between gap-4">
        <div className="bg-[#F5F8FF] w-1/2 p-4 flex flex-col items-center justify-center gap-2 rounded-lg">
          <HiOutlineChatBubbleLeftRight className="size-8 text-primary" />
          <span>실시간 대화</span>
        </div>
        <div className="bg-[#F5F8FF] w-1/2 p-4 flex flex-col items-center justify-center gap-2 rounded-lg">
          <HiOutlineUsers className="size-8 text-[#2CC866]" />
          <span>맞춤형 피드백</span>
        </div>
      </div>
      <div className="flex flex-col gap-4 text-xl">
        <Link href="/interview/settings" className="primary-button">
          시작하기
        </Link>
        <Link
          href="/login"
          className="flex items-center justify-center h-16 p-2 bg-white rounded-lg shadow cursor-pointer"
        >
          로그인
        </Link>
      </div>
      <div className="flex justify-center items-center border-[1px] rounded-lg border-[#FDE68A] bg-[#FFFBEB] p-4">
        <span className="text-[#995523]">
          💡 회원가입 없이도 바로 체험해보실 수 있어요!
        </span>
      </div>
    </div>
  );
}
