import { requireAdmin } from "@/lib/authz";
import NovoUsuarioForm from "./Form";

export default async function NovoUsuarioPage() {
  // Enforce ADMIN permission at the server component level
  await requireAdmin();

  return (
    <div className="p-4 sm:p-8 max-w-lg mx-auto font-sans w-full">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Novo Usuário</h1>
      <NovoUsuarioForm />
    </div>
  );
}
