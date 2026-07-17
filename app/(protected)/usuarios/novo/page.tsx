import { requireAdmin } from "@/lib/authz";
import NovoUsuarioForm from "./Form";

import { PageHeader } from "@/components/ui/PageHeader";

export default async function NovoUsuarioPage() {
  // Enforce ADMIN permission at the server component level
  await requireAdmin();

  return (
    <div className="p-4 sm:p-8 max-w-lg mx-auto font-sans w-full flex flex-col gap-6">
      <PageHeader
        title="Novo Usuário"
        description="Cadastre um novo operador ou administrador para conceder credenciais de acesso ao sistema."
        backHref="/usuarios"
        backLabel="Voltar"
      />
      <NovoUsuarioForm />
    </div>
  );
}
