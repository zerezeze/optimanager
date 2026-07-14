"use client";

import { deleteClient } from "@/app/actions/clients";
import { useState } from "react";

interface DeleteClientButtonProps {
  clientId: string;
}

export default function DeleteClientButton({ clientId }: DeleteClientButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.")) {
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await deleteClient(clientId);
    } catch (err: any) {
      if (err?.message === "NEXT_REDIRECT" || err?.digest?.startsWith("NEXT_REDIRECT")) {
        alert("Cliente excluído com sucesso.");
        throw err;
      }
      setError(err.message || "Ocorreu um erro ao excluir o cliente.");
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "inline-block" }}>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="btn btn-danger"
        style={{ padding: "8px 16px", fontSize: "14px" }}
      >
        {loading ? "Excluindo..." : "Excluir Cliente"}
      </button>
      {error && (
        <div style={{ color: "#d32f2f", fontSize: "13px", marginTop: "8px", display: "block" }}>
          {error}
        </div>
      )}
    </div>
  );
}
