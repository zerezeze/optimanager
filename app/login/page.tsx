import { signIn } from "@/auth";
import { AuthError } from "next-auth";

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const error = params.error;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "Arial, sans-serif", backgroundColor: "#f9f9f9" }}>
      <div style={{ width: "100%", maxWidth: "360px", padding: "32px", backgroundColor: "#ffffff", border: "1px solid #e0e0e0", borderRadius: "6px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
        <h2 style={{ margin: "0 0 24px 0", fontSize: "20px", fontWeight: "bold", textAlign: "center", color: "#333" }}>
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
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <style dangerouslySetInnerHTML={{__html: `
            .login-input {
              padding: 10px 12px;
              border: 1px solid #ccc;
              border-radius: 4px;
              font-size: 14px;
              color: #333333 !important;
              background-color: #ffffff !important;
              caret-color: #333333 !important;
              outline: none;
              box-sizing: border-box;
              transition: border-color 0.2s, box-shadow 0.2s;
            }
            .login-input:focus {
              border-color: #0070f3 !important;
              box-shadow: 0 0 0 3px rgba(0, 112, 243, 0.15);
            }
            .login-input::placeholder {
              color: #888888 !important;
            }
          `}} />

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label htmlFor="email" style={{ fontSize: "14px", fontWeight: "600", color: "#555" }}>
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="login-input"
              placeholder="Digite seu e-mail"
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label htmlFor="password" style={{ fontSize: "14px", fontWeight: "600", color: "#555" }}>
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="login-input"
              placeholder="Digite sua senha"
            />
          </div>

          {error && (
            <div style={{ color: "#d32f2f", fontSize: "13px", margin: "4px 0 0 0" }}>
              {error === "CredentialsSignin"
                ? "Credenciais inválidas. Verifique seu e-mail e senha."
                : "Falha na autenticação. Tente novamente."}
            </div>
          )}

          <button
            type="submit"
            style={{ padding: "10px", backgroundColor: "#0070f3", color: "#ffffff", border: "none", borderRadius: "4px", fontSize: "14px", fontWeight: "600", cursor: "pointer", transition: "background-color 0.2s" }}
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
