"use client";

import { createAccount } from "@/app/register/action";
import Button from "@/components/button";
import GoBack from "@/components/go-back";
import Input from "@/components/Input";
import {
  PASSWORD_MAXLENGTH,
  PASSWORD_MINLENGTH,
  USERNAME_MAXLENGTH,
  USERNAME_MINLENGTH,
} from "@/lib/constants";
import Link from "next/link";
import { useActionState } from "react";

const Register = () => {
  const [state, action] = useActionState(createAccount, null);

  return (
    <div className="page-y-padding">
      <GoBack />
      <form action={action} className="form">
        <h1>회원가입</h1>
        <Input
          type="text"
          placeholder="이름"
          required
          name="username"
          errors={state?.fieldErrors.username}
          minLength={USERNAME_MINLENGTH}
          maxLength={USERNAME_MAXLENGTH}
        />
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
        <Input
          type="password"
          placeholder="비빌번호 확인"
          required
          name="password_confirm"
          errors={state?.fieldErrors.password_confirm}
          minLength={PASSWORD_MINLENGTH}
          maxLength={PASSWORD_MAXLENGTH}
        />
        <Button text="회원가입" />
        <div className="flex items-center justify-center gap-2">
          <span>이미 계정이 있으신가요?</span>
          <Link href="/login" className="text-primary">
            로그인
          </Link>
        </div>
      </form>
    </div>
  );
};
export default Register;
