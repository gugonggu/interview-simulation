import { useRouter } from "next/navigation";
import { HiArrowLeft, HiOutlineChatBubbleLeftRight } from "react-icons/hi2";

const GoBack = () => {
  const router = useRouter();

  const onClick = () => {
    router.back();
  };

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 text-2xl cursor-pointer"
    >
      <HiArrowLeft className="text-black" />
      <HiOutlineChatBubbleLeftRight className="text-primary" />
      <span className="text-black">GPT도 면접은 처음이라</span>
    </button>
  );
};
export default GoBack;
