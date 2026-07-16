"use client";

import { useState, use } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Mail, Glasses } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default function LoginPage({ searchParams }: PageProps) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const params = use(searchParams);
  const errorParam = params.error;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("E-mail ou senha incorretos.");
      } else {
        toast.success("Login realizado com sucesso!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      toast.error("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 font-sans w-full">
      <div className="w-full max-w-sm p-6 sm:p-8 bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
            <Glasses className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800">
            OptiManager
          </h2>
          <p className="text-xs text-gray-400">Entre na sua conta para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-semibold text-gray-600">
              E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Digite seu e-mail"
                style={{ paddingLeft: "42px" }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-semibold text-gray-600">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Digite sua senha"
                style={{ paddingLeft: "42px", paddingRight: "42px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-650 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorParam && (
            <div className="text-red-600 text-xs font-semibold bg-red-50 p-2.5 rounded border border-red-200 mt-1">
              {errorParam === "CredentialsSignin"
                ? "Credenciais inválidas. Verifique seu e-mail e senha."
                : "Falha na autenticação. Tente novamente."}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-3 mt-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
