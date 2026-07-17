"use client";

import { updateClient } from "@/app/actions/clients";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { SectionCard } from "@/components/ui/SectionCard";
import { Button } from "@/components/ui/Button";

interface ClientData {
  id: string;
  nome: string;
  endereco: string | null;
  telefone: string | null;
}

interface EditarFormProps {
  client: ClientData;
}

export default function EditarForm({ client }: EditarFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      await updateClient(client.id, formData);
    } catch (err: any) {
      if (err?.digest?.startsWith("NEXT_REDIRECT")) {
        toast.success("Cliente atualizado com sucesso.");
        throw err;
      }
      setError(err.message || "Não foi possível atualizar os dados do cliente.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      <SectionCard title="Informações do Perfil">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="nome" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Nome Completo *
            </label>
            <input
              id="nome"
              name="nome"
              type="text"
              defaultValue={client.nome}
              required
              maxLength={255}
              className="input-standard"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="telefone" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Telefone
            </label>
            <input
              id="telefone"
              name="telefone"
              type="text"
              defaultValue={client.telefone || ""}
              maxLength={20}
              placeholder="(00) 00000-0000"
              className="input-standard"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="endereco" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Endereço
            </label>
            <input
              id="endereco"
              name="endereco"
              type="text"
              defaultValue={client.endereco || ""}
              maxLength={500}
              placeholder="Rua, Número, Bairro, Cidade"
              className="input-standard"
            />
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
          Salvar Alterações
        </Button>
        <Link href={`/clientes/${client.id}`} className="w-full sm:flex-1">
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
