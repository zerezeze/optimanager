"use client";

import { createUser } from "@/app/actions/users";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { SectionCard } from "@/components/ui/SectionCard";

export default function NovoUsuarioForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      await createUser(formData);
    } catch (err: any) {
      if (err?.digest?.startsWith("NEXT_REDIRECT")) {
        toast.success("Usuário cadastrado com sucesso.");
        throw err;
      }
      setError(err.message || "Não foi possível cadastrar o usuário.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      <SectionCard title="Dados de Acesso">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Nome Completo *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              maxLength={255}
              placeholder="Ex: Pedro de Souza"
              className="input-standard"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              E-mail *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              maxLength={255}
              placeholder="Ex: pedro@optimanager.com"
              className="input-standard"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Senha *
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Mínimo 6 caracteres"
              className="input-standard"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="role" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Perfil *
            </label>
            <select id="role" name="role" required className="w-full input-standard">
              <option value="OPERATOR">Operador</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>
        </div>
      </SectionCard>

      {error && (
        <div className="text-red-600 text-sm px-1 font-semibold">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          type="submit"
          isLoading={loading}
          className="w-full sm:flex-1 py-3 text-sm font-bold shadow-sm"
        >
          Salvar Usuário
        </Button>
        <Link href="/usuarios" className="w-full sm:flex-1">
          <Button
            variant="secondary"
            className="w-full py-3 text-sm font-bold shadow-sm"
          >
            Cancelar
          </Button>
        </Link>
      </div>
    </form>
  );
}
