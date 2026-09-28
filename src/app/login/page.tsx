import type { Metadata } from "next";
import { LoginArt } from "@/components/auth/LoginArt";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next, reason } = await searchParams;
  return (
    <LoginArt>
      <LoginForm next={typeof next === "string" ? next : undefined} reason={typeof reason === "string" ? reason : undefined} />
    </LoginArt>
  );
}
