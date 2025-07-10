"use client";

import { login } from "@/app/login/action";
import Input from "@/components/Input";
import Button from "@/components/button";
import GoBack from "@/components/go-back";
import { PASSWORD_MAXLENGTH, PASSWORD_MINLENGTH } from "@/lib/constants";
import Link from "next/link";
import { useActionState } from "react";

const Login = () => {
  const [state, action] = useActionState(login, null);

  return (
    <div className="page-y-padding">
      <GoBack />
      <form action={action} className="form">
        <h1>로그인</h1>
        <Input
          type="email"
          placeholder="이메일"
          required
          name="email"
          errors={state?.fieldErrors.email}
        />
        <Input
          type="password"
          placeholder="비밀번호"
          required
          name="password"
          errors={state?.fieldErrors.password}
          minLength={PASSWORD_MINLENGTH}
          maxLength={PASSWORD_MAXLENGTH}
        />
        <Button text="로그인" />
        <div className="flex items-center justify-center gap-2">
          <span>계정이 없으신가요?</span>
          <Link href="/register" className="text-primary">
            회원가입
          </Link>
        </div>
      </form>
    </div>
  );
};
export default Login;
