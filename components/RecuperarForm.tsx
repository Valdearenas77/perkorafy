"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { KeyRound } from "lucide-react"; // ícono de contraseña segura

export default function RecuperarForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [cargando, setCargando] = useState(false);

  const validarPassword = (password: string): boolean => {
    return (
      password.length >= 6 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password)
    );
  };

  const handleSubmit = async () => {
    if (!token) {
      toast.error("Token inválido o ausente");
      return;
    }

    if (nuevaPassword !== confirmarPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (!validarPassword(nuevaPassword)) {
      toast.error("La contraseña debe tener al menos 6 caracteres, una mayúscula y un número");
      return;
    }

    setCargando(true);

    const res = await fetch("/api/recuperar/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, nuevaPassword }),
    });

    setCargando(false);

    const data = await res.json();

    if (res.ok) {
      toast.success("Contraseña actualizada. Redirigiendo al login...");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } else {
      toast.error(data.error || "Error al actualizar la contraseña");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow text-center">
      <KeyRound className="mx-auto mb-4 w-10 h-10 text-blue-500" />

      <h1 className="text-2xl font-bold mb-2">Restablecer contraseña</h1>
      <p className="text-sm text-gray-500 mb-6">
        Introduce una nueva contraseña para tu cuenta.
      </p>

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

