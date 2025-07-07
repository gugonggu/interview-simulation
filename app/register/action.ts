"use server";

import {
  PASSWORD_MINLENGTH,
  PASSWORD_REGEX,
  USERNAME_MAXLENGTH,
  USERNAME_MINLENGTH,
} from "@/lib/constants";
import db from "@/lib/db";
import z from "zod";
import bcrypt from "bcrypt";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

const checkPassword = ({
  password,
  password_confirm,
}: {
  password: string;
  password_confirm: string;
}) => {
  return password === password_confirm;
};

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "이름은 문자열이어야 해요",
        required_error: "이름은 필수 입력 항목이에요",
      })
      .trim()
      .min(USERNAME_MINLENGTH, "이름은 2글자 이상이어야 해요")
      .max(USERNAME_MAXLENGTH, "이름은 10글자 이하이어야 해요"),
    email: z.string().email("이메일 형식으로 입력해야 해요"),
    password: z
      .string()
      .min(PASSWORD_MINLENGTH, "비밀번호는 8글자 이상이어야 해요")
      .max(20, "비밀번호는 20글자 이하이어야 해요")
      .regex(
        PASSWORD_REGEX,
        "비밀번호는 대문자, 소문자, 숫자, 특수문자를 포함해야 해요"
      ),
    password_confirm: z
      .string()
      .min(PASSWORD_MINLENGTH, "비밀번호는 8글자 이상이어야 해요")
      .max(20, "비밀번호는 20글자 이하이어야 해요"),
  })
  .superRefine(async ({ username }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "이미 사용 중인 이름이에요",
        path: ["username"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .superRefine(async ({ email }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "이미 사용 중인 이메일이에요",
        path: ["email"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .refine(checkPassword, {
    message: "비밀번호가 일치하지 않아요",
    path: ["password_confirm"],
  });

export const createAccount = async (_: any, formData: FormData) => {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    password_confirm: formData.get("password_confirm"),
  };

  const result = await formSchema.safeParseAsync(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    const hashedPassword = await bcrypt.hash(result.data.password, 12);

    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });

    const session = await getSession();
    session.id = user.id;
    await session.save();
    redirect("/");
  }
};
