import { signIn } from "@/auth";
import { AuthError } from "next-auth";

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const error = params.error;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 font-sans w-full">
      <div className="w-full max-w-sm p-6 sm:p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-6">
          OptiManager - Login
        </h2>

        <form
          action={async (formData) => {
            "use server";
            try {
              await signIn("credentials", formData);
            } catch (err) {
              if (err instanceof AuthError) {
                // Throw error so NextAuth redirect mechanism works correctly
                throw err;
              }
              throw err;
            }
          }}
          className="flex flex-col gap-4 w-full"
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-semibold text-gray-600">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Digite seu e-mail"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-semibold text-gray-600">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Digite sua senha"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm mt-1">
              {error === "CredentialsSignin"
                ? "Credenciais inválidas. Verifique seu e-mail e senha."
                : "Falha na autenticação. Tente novamente."}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full py-3 mt-2"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
