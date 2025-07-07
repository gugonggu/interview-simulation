"use server";

import {
  PASSWORD_MAXLENGTH,
  PASSWORD_MINLENGTH,
  PASSWORD_REGEX,
} from "@/lib/constants";
import db from "@/lib/db";
import z from "zod";
import bcrypt from "bcrypt";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
    },
  });

  return Boolean(user);
};

const formSchema = z.object({
  email: z
    .string()
    .email()
    .toLowerCase()
    .refine(checkEmailExists, "이메일이 존재하지 않아요"),
  password: z
    .string({
      required_error: "비밀번호는 필수에요",
    })
    .min(PASSWORD_MINLENGTH, "비밀번호는 8글자 이상이어야 해요")
    .max(PASSWORD_MAXLENGTH, "비밀번호는 20글자 이하이어야 해요")
    .regex(PASSWORD_REGEX, "비밀번호는 영문, 숫자, 특수문자를 포함해야 해요"),
});

export const login = async (prevState: any, formData: FormData) => {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        id: true,
        password: true,
      },
    });

    const ok = await bcrypt.compare(
      result.data.password,
      user!.password ?? "xxx"
    );

    if (ok) {
      const session = await getSession();
      session.id = user!.id;
      await session.save();
      redirect("/interview/settings");
    } else {
      return {
        fieldErrors: {
          password: ["잘못된 비밀번호입니다."],
          email: [],
        },
      };
    }
  }
};
