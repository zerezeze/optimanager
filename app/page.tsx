import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

  // If user is already authenticated, redirect directly to dashboard
  if (session && session.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans w-full">
      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-lg p-6 sm:p-10 bg-white border border-gray-200 rounded-lg shadow-sm text-center">
          
          {/* Header Section */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">OptiManager</h1>
          <p className="text-lg sm:text-xl text-blue-600 font-semibold mb-4">
            Sistema de Gestão para Óticas
          </p>
          <p className="text-sm sm:text-base text-gray-500 leading-relaxed mb-8">
            Centralize e simplifique o controle diário de sua ótica. Gerencie cadastros de clientes, prontuários de exames refrativos, prescrições de lentes e receitas comerciais em um só lugar.
          </p>

          {/* Feature List Section */}
          <div className="text-left mb-8 border-t border-gray-100 pt-6">
            <h2 className="text-sm font-bold text-gray-800 mb-3">Recursos Principais:</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-blue-600 font-bold">&bull;</span> Cadastro de Clientes
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-blue-600 font-bold">&bull;</span> Histórico de Consultas
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-blue-600 font-bold">&bull;</span> Gestão de Receitas
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-blue-600 font-bold">&bull;</span> Pesquisa Rápida
              </li>
            </ul>
          </div>

          {/* Action Button Section */}
          <div className="flex justify-center">
            <Link
              href="/login"
              className="btn btn-primary w-full sm:max-w-xs py-3.5 text-base"
            >
              Entrar no Sistema
            </Link>
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="p-6 border-t border-gray-200 bg-white text-center text-gray-400 text-xs sm:text-sm">
        <p className="mb-1 font-semibold">&copy; 2026 OptiManager</p>
        <p>Desenvolvido por José Everton</p>
      </footer>
    </div>
  );
}
