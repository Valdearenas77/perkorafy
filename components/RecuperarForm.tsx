"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { KeyRound, CheckCircle, XCircle } from "lucide-react";

export default function RecuperarForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [cargando, setCargando] = useState(false);

  const cumpleLongitud = nuevaPassword.length >= 6;
  const tieneMayuscula = /[A-Z]/.test(nuevaPassword);
  const tieneNumero = /[0-9]/.test(nuevaPassword);

  const handleSubmit = async () => {
    if (!token) {
      toast.error("Token inválido o ausente");
      return;
    }

    if (nuevaPassword !== confirmarPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (!(cumpleLongitud && tieneMayuscula && tieneNumero)) {
      toast.error("La contraseña no cumple los requisitos mínimos");
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
        className="mb-2"
      />

      <Input
        type="password"
        placeholder="Confirmar contraseña"
        value={confirmarPassword}
        onChange={(e) => setConfirmarPassword(e.target.value)}
        className="mb-4"
      />

      <div className="text-left text-sm mb-4">
        <p className="font-medium mb-1">Requisitos:</p>
        <div className="flex items-center gap-2">
          {cumpleLongitud ? (
            <CheckCircle className="text-green-600 w-4 h-4" />
          ) : (
            <XCircle className="text-red-500 w-4 h-4" />
          )}
          <span>Mínimo 6 caracteres</span>
        </div>
        <div className="flex items-center gap-2">
          {tieneMayuscula ? (
            <CheckCircle className="text-green-600 w-4 h-4" />
          ) : (
            <XCircle className="text-red-500 w-4 h-4" />
          )}
          <span>Al menos una mayúscula</span>
        </div>
        <div className="flex items-center gap-2">
          {tieneNumero ? (
            <CheckCircle className="text-green-600 w-4 h-4" />
          ) : (
            <XCircle className="text-red-500 w-4 h-4" />
          )}
          <span>Al menos un número</span>
        </div>
      </div>

      <Button onClick={handleSubmit} disabled={cargando} className="w-full">
        {cargando ? "Guardando..." : "Guardar nueva contraseña"}
      </Button>
    </div>
  );
}

