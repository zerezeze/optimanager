"use client";

import { createUser } from "@/app/actions/users";
import Link from "next/link";
import { useState } from "react";

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
      setError(err.message || "Ocorreu um erro ao cadastrar o usuário.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-semibold text-gray-600">
          Nome Completo *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={255}
          placeholder="Ex: Pedro de Souza"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-semibold text-gray-600">
          E-mail *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={255}
          placeholder="Ex: pedro@optimanager.com"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-semibold text-gray-600">
          Senha *
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder="Mínimo 6 caracteres"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="role" className="text-sm font-semibold text-gray-600">
          Perfil *
        </label>
        <select id="role" name="role" required className="w-full">
          <option value="OPERATOR">Operador</option>
          <option value="ADMIN">Administrador</option>
        </select>
      </div>

      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full sm:flex-1 py-3"
        >
          {loading ? "Salvando..." : "Salvar Usuário"}
        </button>
        <Link
          href="/usuarios"
          className="btn btn-secondary w-full sm:w-auto py-3 text-center px-6"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
