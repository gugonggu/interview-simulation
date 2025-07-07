"use client";

import { useFormStatus } from "react-dom";

interface ButtonProps {
  text: string;
}

const Button = ({ text }: ButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} className="primary-button">
      {pending ? "로딩 중..." : text}
    </button>
  );
};
export default Button;
