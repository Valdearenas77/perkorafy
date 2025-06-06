"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function OlvideContrasenaPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Por favor, introduce tu email");
      return;
    }

    const res = await fetch("/api/recuperar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Correo enviado. Revisa tu bandeja.");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } else {
      toast.error(data.error || "Ocurrió un error");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-4 border rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">¿Olvidaste tu contraseña?</h1>
      <Input
        type="email"
        placeholder="Tu email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4"
      />
      <Button onClick={handleSubmit} className="w-full">
        Enviar enlace de recuperación
      </Button>
    </div>
  );
}
