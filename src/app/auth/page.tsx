"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type TabType = "login" | "register";

export default function AuthPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("login");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const endpoint =
      activeTab === "login" ? "/api/auth/login" : "/api/auth/register";

    const data: Record<string, string> = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    if (activeTab === "register") {
      data.name = formData.get("name") as string;
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Erro ao processar requisição");
        return;
      }

      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      const successMessage =
        activeTab === "login"
          ? "Login realizado com sucesso!"
          : "Conta criada com sucesso!";

      toast.success(successMessage);
      router.push("/dashboard");
    } catch (error) {
      toast.error("Erro ao conectar com o servidor");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Imagem de Fundo */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-linear-to-br from-dark via-dark-lighter to-dark overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/cook-becker/image/fetch/q_auto:good,f_auto,w_1920/https://candb.com/site/candb/images/artwork/players-handbook-2024-tyler-jacobson-dnd.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_40%,rgba(0,0,0,0.4)_70%,rgba(0,0,0,0.8)_100%)]" />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent" />
        <Link
          href="/"
          className="absolute top-8 left-8 z-20 flex items-center justify-center w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-all hover:scale-110 border border-gold/30"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
        <div className="absolute bottom-0 left-0 right-0 p-12 text-white z-10">
          <h2 className="text-5xl font-bold mb-4 drop-shadow-2xl">
            Dungeons & Dragons
          </h2>
          <div className="flex items-center gap-4 text-gold-pale">
            <p className="text-lg font-medium">Wizards of the Coast</p>
            <span className="text-gold">•</span>
            <p className="text-lg font-medium">1974</p>
          </div>
        </div>
      </div>

      {/* Formulario de Cadastro */}
      <div className="flex-1 flex items-center justify-center p-8 bg-linear-to-br from-dark via-primary-dark to-dark">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold text-white mb-2 drop-shadow-lg">
              🎲 Rolld
            </h1>
            <p className="text-gold-pale font-medium">
              Avaliação colaborativa de RPGs
            </p>
          </div>

          <div className="flex gap-4 mb-8 bg-black/30 rounded-full p-1 backdrop-blur-sm">
            <button
              onClick={() => setActiveTab("login")}
              disabled={activeTab === "login"}
              className={`flex-1 py-3 text-center font-bold transition-colors duration-200 ease-in-out rounded-full ${
                activeTab === "login"
                  ? "bg-linear-to-r from-gold to-gold-light text-dark shadow-lg shadow-gold/30 cursor-default"
                  : "text-gold-pale hover:text-gold cursor-pointer"
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setActiveTab("register")}
              disabled={activeTab === "register"}
              className={`flex-1 py-3 text-center font-bold transition-colors duration-200 ease-in-out rounded-full ${
                activeTab === "register"
                  ? "bg-linear-to-r from-gold to-gold-light text-dark shadow-lg shadow-gold/30 cursor-default"
                  : "text-gold-pale hover:text-gold cursor-pointer"
              }`}
            >
              Criar conta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nome */}
            {activeTab === "register" && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-bold text-gold mb-2"
                >
                  Nome completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 bg-black/30 border-2 border-gold/30 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition outline-none text-white placeholder:text-gray-400 backdrop-blur-sm"
                  placeholder="Seu nome"
                />
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-gold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 bg-black/30 border-2 border-gold/30 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition outline-none text-white placeholder:text-gray-400 backdrop-blur-sm"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold text-gold mb-2"
              >
                Senha
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                minLength={6}
                className="w-full px-4 py-3 bg-black/30 border-2 border-gold/30 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition outline-none text-white placeholder:text-gray-400 backdrop-blur-sm"
                placeholder={
                  activeTab === "register" ? "Mínimo 6 caracteres" : "Sua senha"
                }
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-gold to-gold-light text-dark py-4 rounded-lg font-bold hover:shadow-xl hover:shadow-gold/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] border-2 border-gold cursor-pointer"
            >
              {loading
                ? activeTab === "login"
                  ? "Entrando..."
                  : "Criando conta..."
                : activeTab === "login"
                  ? "Entrar"
                  : "Criar conta"}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gold-pale">
            {activeTab === "login" ? (
              <p>
                Primeira vez aqui?{" "}
                <button
                  onClick={() => setActiveTab("register")}
                  className="text-gold hover:text-gold-light font-bold"
                >
                  Crie uma conta
                </button>
              </p>
            ) : (
              <p>
                Já tem uma conta?{" "}
                <button
                  onClick={() => setActiveTab("login")}
                  className="text-gold hover:text-gold-light font-bold"
                >
                  Faça login
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
