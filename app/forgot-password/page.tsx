import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6 text-center">Recuperar contraseña</h1>

        <form className="w-full flex flex-col gap-4">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm mb-1 font-semibold">
              Introduce tu correo electrónico
            </label>
            <input
              id="email"
              type="email"
              placeholder="ejemplo@correo.com"
              className="border rounded-xl px-4 py-2 text-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-primary text-primary-foreground rounded-xl py-3 font-semibold hover:bg-primary/90 transition"
          >
            Enviar instrucciones
          </button>

          <Link
            href="/login"
            className="text-xs text-primary hover:underline text-center mt-4"
          >
            Volver al login
          </Link>
        </form>
      </div>
    </div>
  );
}
