// app/login/page.tsx
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader className="flex flex-col items-center justify-center space-y-4 pt-6">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={64}
            height={64}
          />
          <h1 className="text-2xl font-bold">Perkorafy</h1>
        </CardHeader>
        <CardContent className="space-y-4 px-6 pb-6">
          <Input type="text" placeholder="Usuario" />
          <Input type="password" placeholder="Contraseña" />
          <div className="text-right text-sm">
            <a href="#" className="text-blue-600 hover:underline">
              ¿Has olvidado tu contraseña?
            </a>
          </div>
          <Button className="w-full">Iniciar sesión</Button>
        </CardContent>
      </Card>
    </div>
  );
}
