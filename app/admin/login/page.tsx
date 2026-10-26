import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/Logo";
import { getAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin");
  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-4 py-12">
      <Logo markClassName="h-12 w-12" textClassName="font-display text-2xl" imageClassName="h-12 w-auto" />
      <h1 className="mt-8 font-display text-4xl">Painel da loja</h1>
      <p className="mt-2 text-muted">Entre com o e-mail e a senha de administradora.</p>
      <LoginForm />
    </main>
  );
}
