"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ReactNode } from "react";

interface HeaderProps {
  user: {
    name: string;
    email: string;
  };
  guildContext?: {
    guildName: string;
    isAdmin: boolean;
    onInviteClick: () => void;
  };
  actions?: ReactNode;
}

export default function Header({ user, guildContext, actions }: HeaderProps) {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; max-age=0";
    toast.success("Logout realizado com sucesso!");
    router.push("/auth");
  }

  return (
    <header className="border-b border-gold/10 bg-dark-lighter/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {guildContext && (
              <button
                onClick={() => router.push("/dashboard")}
                className="text-gray-400 hover:text-gold transition-colors text-sm"
              >
                ← Voltar
              </button>
            )}

            {guildContext ? (
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  🏰 {guildContext.guildName}
                </h1>
                {guildContext.isAdmin && (
                  <span className="bg-gold text-dark text-xs font-bold px-2 py-1 rounded">
                    ADMIN
                  </span>
                )}
              </div>
            ) : (
              <h1
                onClick={() => router.push("/dashboard")}
                className="text-2xl font-rpg text-gold tracking-wider flex items-center gap-3 cursor-pointer hover:text-gold-light transition-colors"
              >
                <span className="text-3xl">⚅</span>
                Rolld
              </h1>
            )}
          </div>

          <div className="flex items-center gap-3">
            {actions}

            {guildContext?.isAdmin && (
              <button
                onClick={guildContext.onInviteClick}
                className="bg-gold hover:bg-gold-light text-dark text-sm font-bold px-4 py-2 rounded transition-colors"
              >
                + Convidar Membro
              </button>
            )}

            <div className="hidden md:block text-right">
              <div className="text-sm font-serif font-semibold text-white tracking-wide">
                {user.name}
              </div>
              <div className="text-xs text-gray-500 italic">{user.email}</div>
            </div>

            <button
              onClick={handleLogout}
              className="text-sm font-serif text-gray-400 hover:text-gold transition-colors border border-gray-700 hover:border-gold/30 px-4 py-2 rounded"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
