export const dynamic = "force-dynamic";

"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function RecuperarPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async () => {
    if (!token) {
      toast.error("Token inválido o ausente");
      return;
    }

    if (nuevaPassword !== confirmarPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setCargando(true);

    const res = await fetch("/api/recuperar/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, nuevaPassword }),
    });

    const data = await res.json();
    setCargando(false);

    if (res.ok) {
      toast.success("Contraseña actualizada correctamente");
    } else {
      toast.error(data.error || "Error al actualizar la contraseña");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-4 border rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Restablecer contraseña</h1>

      <Input
        type="password"
        placeholder="Nueva contraseña"
        value={nuevaPassword}
        onChange={(e) => setNuevaPassword(e.target.value)}
        className="mb-4"
      />

      <Input
        type="password"
        placeholder="Confirmar contraseña"
        value={confirmarPassword}
        onChange={(e) => setConfirmarPassword(e.target.value)}
        className="mb-4"
      />

      <Button onClick={handleSubmit} disabled={cargando} className="w-full">
        {cargando ? "Guardando..." : "Guardar nueva contraseña"}
      </Button>
    </div>
  );
}
