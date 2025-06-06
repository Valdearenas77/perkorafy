"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function OlvideContrasenaPage() {
  const [email, setEmail] = useState("");
  const [cargando, setCargando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Por favor, introduce tu email");
      return;
    }

    setCargando(true);

    const res = await fetch("/api/recuperar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setCargando(false);

    // Siempre mostrar el mismo mensaje, para evitar que se detecten correos válidos
    toast.success("Si el email existe, se ha enviado un enlace de recuperación.");
    setEnviado(true);
    setTimeout(() => {
      router.push("/login");
    }, 3000);
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow text-center">
      <Lock className="mx-auto mb-4 w-10 h-10 text-blue-500" />

      <h1 className="text-2xl font-bold mb-2">¿Olvidaste tu contraseña?</h1>
      <p className="text-sm text-gray-500 mb-6">
        Escribe tu correo y te enviaremos un enlace para restablecerla.
      </p>

      <Input
        type="email"
        placeholder="Tu email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4"
      />

      <Button onClick={handleSubmit} disabled={cargando} className="w-full">
        {cargando ? "Enviando..." : "Enviar enlace de recuperación"}
      </Button>

      {enviado && (
        <p className="text-green-600 text-sm mt-4">
          Correo enviado. Serás redirigido al login en unos segundos...
        </p>
      )}
    </div>
  );
}
