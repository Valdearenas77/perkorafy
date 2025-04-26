import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md flex flex-col items-center">
        <Image
          src="/images/logo.png"
          alt="Perkorafy Logo"
          width={100}
          height={100}
          className="mb-6"
        />
        <h1 className="text-2xl font-bold mb-6 text-center">Perkorafy</h1>

        <form className="w-full flex flex-col gap-4">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm mb-1 font-semibold">
              Usuario
            </label>
            <input
              id="email"
              type="email"
              placeholder="Introduce tu usuario"
              className="border rounded-xl px-4 py-2 text-sm"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="text-sm mb-1 font-semibold">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="Introduce tu contraseña"
              className="border rounded-xl px-4 py-2 text-sm"
              required
            />
          </div>

          <Link
            href="/forgot-password"
            className="text-xs text-primary hover:underline self-end"
          >
            ¿Olvidaste tu contraseña?
          </Link>

          <Link
            href="/home"
            className="bg-primary text-primary-foreground rounded-xl py-3 font-semibold text-center hover:bg-primary/90 transition"
          >
            Entrar
          </Link>
        </form>
      </div>
    </div>
  );
}

