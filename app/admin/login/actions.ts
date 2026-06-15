"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  clearFailedAttempts,
  isLockedOut,
  recordFailedAttempt,
  verifyPassword,
} from "@/lib/auth";
import { createSession } from "@/lib/session";

export type LoginState = {
  error?: string;
};

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const password = formData.get("password");

  if (typeof password !== "string" || !password) {
    return { error: "Password is required." };
  }

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (isLockedOut(ip)) {
    return { error: "Too many failed attempts. Try again in 15 minutes." };
  }

  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!passwordHash || !verifyPassword(password, passwordHash)) {
    recordFailedAttempt(ip);
    return { error: "Incorrect password." };
  }

  clearFailedAttempts(ip);
  await createSession();
  redirect("/admin");
}
