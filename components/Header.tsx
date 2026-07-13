import { signOut } from "@/auth";
import Link from "next/link";

interface HeaderProps {
  email?: string | null;
}

export default function Header({ email }: HeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 sm:py-4 sm:px-8 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-start">
        <strong className="text-lg text-gray-800">OptiManager</strong>
        <nav className="flex gap-4">
          <Link href="/dashboard" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
            Dashboard
          </Link>
          <Link href="/clientes" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
            Clientes
          </Link>
        </nav>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t border-gray-100 sm:border-t-0 pt-3 sm:pt-0">
        {email && (
          <span className="text-sm text-gray-600 truncate max-w-[180px] sm:max-w-xs" title={email}>
            {email}
          </span>
        )}
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
          className="shrink-0"
        >
          <button
            type="submit"
            className="btn btn-secondary"
            style={{ padding: "6px 12px", fontSize: "13px" }}
          >
            Sair
          </button>
        </form>
      </div>
    </header>
  );
}
