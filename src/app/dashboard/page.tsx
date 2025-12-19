"use client";
//Dashbord Temporario (mto feio)
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";

interface User {
  id: string;
  email: string;
  name: string;
}

function getUserFromStorage(): User | null {
  if (typeof window === "undefined") return null;

  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

//TODO: Fazer dados reais depois que implementar API
const mockFavoriteRPGs = [
  { id: 1, name: "D&D 5e", cover: "🐉", rating: 5 },
  { id: 2, name: "Pathfinder 2e", cover: "⚔️", rating: 4.5 },
  { id: 3, name: "Call of Cthulhu", cover: "🐙", rating: 5 },
  { id: 4, name: "Tormenta20", cover: "🏰", rating: 4 },
];

const mockRecentReviews = [
  {
    id: 1,
    name: "Blades in the Dark",
    cover: "🗡️",
    rating: 4.5,
    date: "2 dias atrás",
  },
  {
    id: 2,
    name: "Vampire: The Masquerade",
    cover: "🦇",
    rating: 4,
    date: "1 semana atrás",
  },
  {
    id: 3,
    name: "Cyberpunk RED",
    cover: "🤖",
    rating: 3.5,
    date: "2 semanas atrás",
  },
  { id: 4, name: "FATE Core", cover: "🎲", rating: 4, date: "3 semanas atrás" },
  {
    id: 5,
    name: "Monster of the Week",
    cover: "👻",
    rating: 4.5,
    date: "1 mês atrás",
  },
];

const mockGuilds = [
  {
    id: 1,
    name: "Mesa de Quinta",
    members: 6,
    activePolls: 2,
    color: "from-primary to-primary-light",
  },
  {
    id: 2,
    name: "RPG Nostálgico",
    members: 12,
    activePolls: 0,
    color: "from-gold to-gold-light",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const user = getUserFromStorage();
  const [activeTab, setActiveTab] = useState<
    "overview" | "activity" | "guilds"
  >("overview");

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; max-age=0";

    toast.success("Logout realizado com sucesso!");
    router.push("/auth");
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="bg-dark-lighter border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-gold flex items-center gap-2">
                🎲 <span className="text-white">Rolld</span>
              </h1>
              <nav className="hidden md:flex gap-6">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`text-sm font-medium transition-colors ${
                    activeTab === "overview"
                      ? "text-gold"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Visão Geral
                </button>
                <button
                  onClick={() => setActiveTab("activity")}
                  className={`text-sm font-medium transition-colors ${
                    activeTab === "activity"
                      ? "text-gold"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Atividade
                </button>
                <button
                  onClick={() => setActiveTab("guilds")}
                  className={`text-sm font-medium transition-colors ${
                    activeTab === "guilds"
                      ? "text-gold"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Guildas
                </button>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <div className="text-sm font-medium text-white">
                  {user.name}
                </div>
                <div className="text-xs text-gray-400">{user.email}</div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-primary hover:bg-primary-light text-white text-sm font-medium px-4 py-2 rounded transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3">
            <div className="bg-dark-lighter border border-primary/20 rounded-lg p-6 sticky top-8">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-24 h-24 bg-linear-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 border-2 border-gold/30">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-bold text-white mb-1">
                  {user.name}
                </h2>
                <p className="text-sm text-gray-400 mb-4">
                  @{user.name.toLowerCase().replace(/\s+/g, "")}
                </p>
              </div>

              <div className="border-t border-primary/20 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">RPGs Avaliados</span>
                  <span className="text-white font-medium">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Guildas</span>
                  <span className="text-white font-medium">
                    {mockGuilds.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Reviews</span>
                  <span className="text-white font-medium">0</span>
                </div>
              </div>

              <button className="w-full mt-6 bg-gold hover:bg-gold-light text-dark text-sm font-bold py-2 rounded transition-colors">
                Editar Perfil
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-8">
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">RPGs Favoritos</h2>
                <button className="text-sm text-gold hover:text-gold-light transition-colors">
                  Editar
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mockFavoriteRPGs.map((rpg, index) => (
                  <div
                    key={rpg.id}
                    className="group relative aspect-2/3 bg-linear-to-br from-dark-lighter to-primary-dark rounded-lg border border-primary/30 hover:border-gold/50 transition-all cursor-pointer overflow-hidden"
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                      <div className="text-6xl mb-2">{rpg.cover}</div>
                      <h3 className="text-white text-sm font-bold text-center mb-2">
                        {rpg.name}
                      </h3>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-xs ${i < rpg.rating ? "text-gold" : "text-gray-600"}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="absolute top-2 left-2 w-6 h-6 bg-gold rounded-full flex items-center justify-center text-dark text-xs font-bold">
                      {index + 1}
                    </div>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        Ver Detalhes
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {mockFavoriteRPGs.length === 0 && (
                <div className="border-2 border-dashed border-primary/30 rounded-lg p-12 text-center">
                  <p className="text-gray-400 mb-4">
                    Selecione seus 4 RPGs favoritos
                  </p>
                  <button className="bg-primary hover:bg-primary-light text-white text-sm font-medium px-6 py-2 rounded transition-colors">
                    Escolher RPGs
                  </button>
                </div>
              )}
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">
                  Avaliados Recentemente
                </h2>
                <button className="text-sm text-gold hover:text-gold-light transition-colors">
                  Ver Todos
                </button>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-primary scrollbar-track-dark-lighter">
                {mockRecentReviews.map((rpg) => (
                  <div
                    key={rpg.id}
                    className="shrink-0 w-32 group cursor-pointer"
                  >
                    <div className="aspect-2/3 bg-linear-to-br from-dark-lighter to-primary-dark rounded-lg border border-primary/30 hover:border-gold/50 transition-all mb-2 flex flex-col items-center justify-center p-3 relative overflow-hidden">
                      <div className="text-4xl mb-2">{rpg.cover}</div>
                      <h3 className="text-white text-xs font-bold text-center line-clamp-2">
                        {rpg.name}
                      </h3>
                      <div className="absolute bottom-2 flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-xs ${i < rpg.rating ? "text-gold" : "text-gray-600"}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 text-center">
                      {rpg.date}
                    </p>
                  </div>
                ))}
              </div>
              {mockRecentReviews.length === 0 && (
                <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center">
                  <p className="text-gray-400 mb-4">
                    Você ainda não avaliou nenhum RPG
                  </p>
                  <button className="bg-primary hover:bg-primary-light text-white text-sm font-medium px-6 py-2 rounded transition-colors">
                    Explorar RPGs
                  </button>
                </div>
              )}
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Minhas Guildas</h2>
                <button className="bg-gold hover:bg-gold-light text-dark text-sm font-bold px-4 py-2 rounded transition-colors">
                  + Nova Guilda
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockGuilds.map((guild) => (
                  <div
                    key={guild.id}
                    className="bg-dark-lighter border border-primary/30 hover:border-gold/50 rounded-lg p-6 cursor-pointer transition-all group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-gold transition-colors">
                          {guild.name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {guild.members} membros
                        </p>
                      </div>
                      <div
                        className={`w-12 h-12 bg-linear-to-br ${guild.color} rounded-lg flex items-center justify-center text-white text-xl`}
                      >
                        🏰
                      </div>
                    </div>
                    <div className="border-t border-primary/20 pt-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-400">Votações Ativas</p>
                        <p className="text-2xl font-bold text-white">
                          {guild.activePolls}
                        </p>
                      </div>
                      <button className="bg-primary hover:bg-primary-light text-white text-sm font-medium px-4 py-2 rounded transition-colors">
                        Acessar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {mockGuilds.length === 0 && (
                <div className="border-2 border-dashed border-primary/30 rounded-lg p-12 text-center">
                  <div className="text-6xl mb-4">🏰</div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Crie sua primeira Guilda
                  </h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    Convide seus amigos para avaliar sistemas de RPG juntos e
                    descobrir qual é o favorito da mesa
                  </p>
                  <button className="bg-gold hover:bg-gold-light text-dark text-sm font-bold px-6 py-3 rounded transition-colors">
                    Criar Guilda
                  </button>
                </div>
              )}
            </section>

            <section className="pb-8">
              <h2 className="text-xl font-bold text-white mb-4">
                Atividade Recente
              </h2>
              <div className="bg-dark-lighter border border-primary/20 rounded-lg divide-y divide-primary/10">
                <div className="p-8 text-center">
                  <p className="text-gray-400">Nenhuma atividade recente</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
