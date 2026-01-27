"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import RPGCard from "@/components/RPGCard";
import RatingsChart from "@/components/RatingsChart";

interface User {
  id: string;
  email: string;
  name: string;
}

interface Guild {
  id: string;
  name: string;
  admin: {
    id: string;
    name: string;
    email: string;
  };
  _count: {
    members: number;
    votingSessions: number;
  };
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

const mockRatingsDistribution = {
  0: 0,
  0.5: 1,
  1: 0,
  1.5: 2,
  2: 1,
  2.5: 3,
  3: 2,
  3.5: 5,
  4: 8,
  4.5: 12,
  5: 15,
};

export default function DashboardPage() {
  const router = useRouter();
  const user = getUserFromStorage();
  const [activeTab, setActiveTab] = useState<
    "overview" | "activity" | "guilds"
  >("overview");

  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loadingGuilds, setLoadingGuilds] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGuildName, setNewGuildName] = useState("");
  const [creatingGuild, setCreatingGuild] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Carregar guildas quando montar
  useEffect(() => {
    loadGuilds();
  }, []);

  async function loadGuilds() {
    setLoadingGuilds(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/guilds", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao carregar guildas");
      }

      const data = await response.json();
      setGuilds(data.guilds);
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao carregar guildas");
    } finally {
      setLoadingGuilds(false);
    }
  }

  async function handleCreateGuild(e: React.FormEvent) {
    e.preventDefault();

    if (!newGuildName.trim()) {
      toast.error("Nome da guilda é obrigatório");
      return;
    }

    if (newGuildName.trim().length < 3) {
      toast.error("Nome deve ter no mínimo 3 caracteres");
      return;
    }

    setCreatingGuild(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/guilds", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newGuildName }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Erro ao criar guilda");
        return;
      }

      toast.success("Guilda criada com sucesso!");
      setNewGuildName("");
      setShowCreateModal(false);
      loadGuilds();
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao criar guilda");
    } finally {
      setCreatingGuild(false);
    }
  }

  async function handleDeleteGuild(guildId: string, guildName: string) {
    if (!confirm(`Tem certeza que deseja deletar a guilda "${guildName}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/guilds/${guildId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Erro ao deletar guilda");
        return;
      }

      toast.success("Guilda deletada com sucesso!");
      loadGuilds();
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao deletar guilda");
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="animate-pulse text-gold text-xl tracking-wide">
          Rolling the dice...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark parchment-texture">
      <Header user={user} />

      <main className="mx-auto px-6 py-12" style={{ maxWidth: "950px" }}>
        {/* Profile Header - Character Sheet Inspired */}
        <div className={`mb-16 ${mounted ? "reveal-stagger" : "opacity-0"}`}>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar & Core Stats */}
            <div className="flex gap-6 items-start">
              <div className="relative group">
                <div className="w-32 h-32 rounded border-4 border-gold/40 bg-linear-to-br from-primary-dark to-primary overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center text-white text-5xl font-rpg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {/* Corner ornaments */}
                <div className="absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 border-gold" />
                <div className="absolute -top-1 -right-1 w-3 h-3 border-r-2 border-t-2 border-gold" />
                <div className="absolute -bottom-1 -left-1 w-3 h-3 border-l-2 border-b-2 border-gold" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 border-gold" />
              </div>

              {/* Character Stats Block */}
              <div className="space-y-3">
                <div>
                  <h2 className="text-3xl font-rpg text-white mb-1 tracking-wide">
                    {user.name}
                  </h2>
                  <p className="text-sm text-gray-500 font-serif italic">
                    @{user.name.toLowerCase().replace(/\s+/g, "")}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="text-center border border-gold/20 rounded p-2 bg-dark-lighter/50">
                    <div className="text-2xl font-rpg text-gold">0</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-serif">
                      Reviews
                    </div>
                  </div>
                  <div className="text-center border border-gold/20 rounded p-2 bg-dark-lighter/50">
                    <div className="text-2xl font-rpg text-gold">
                      {guilds.length}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-serif">
                      Guildas
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1" />

            {/* Action Button */}
            <button className="border-2 border-gold/40 hover:border-gold text-gold hover:text-gold-light px-6 py-2.5 rounded font-serif font-semibold tracking-wide transition-all hover-lift bg-dark-lighter/30">
              Editar Perfil
            </button>
          </div>

          {/* Ornamental Divider */}
          <div className="mt-8 flex items-center gap-3">
            <div className="flex gap-1">
              <div className="dice-pip text-gold/30" />
              <div className="dice-pip text-gold/50" />
              <div className="dice-pip text-gold/30" />
            </div>
            <div className="flex-1 h-px bg-linear-to-r from-gold/30 via-gold/10 to-transparent" />
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="w-full lg:w-[630px]">
            {/* Favorite RPGs - Grid Gallery */}
            <section
              className={`mb-12 ${mounted ? "reveal-stagger" : "opacity-0"}`}
              style={{ animationDelay: "0.1s" }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-rpg text-white tracking-wide flex items-center gap-2">
                  <span className="text-gold">★</span>
                  Favoritos
                </h2>
                <button className="text-sm font-serif text-gray-400 hover:text-gold transition-colors italic">
                  Editar seleção →
                </button>
              </div>

              <div className="flex gap-[10px] overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gold/20 scrollbar-track-transparent">
                {mockFavoriteRPGs.map((rpg) => (
                  <RPGCard key={rpg.id} {...rpg} />
                ))}
              </div>
            </section>

            {/* Recent Reviews - Letterboxd Style */}
            <section
              className={`mb-16 ${mounted ? "reveal-stagger" : "opacity-0"}`}
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-rpg text-white tracking-wide">
                  Avaliados Recentemente
                </h2>
                <button className="text-sm font-serif text-gray-400 hover:text-gold transition-colors italic">
                  Ver todos →
                </button>
              </div>

              <div className="flex gap-[10px] overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gold/20 scrollbar-track-transparent">
                {mockRecentReviews.slice(0, 4).map((rpg) => (
                  <RPGCard key={rpg.id} {...rpg} />
                ))}
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <aside className="w-full lg:w-[150px]">
            <RatingsChart ratings={mockRatingsDistribution} />
          </aside>
        </div>

        {/* Full Width Sections */}
        {/* Guilds Section - Quest Scrolls */}
        <section
          className={`mb-16 ${mounted ? "reveal-stagger" : "opacity-0"}`}
          style={{ animationDelay: "0.3s" }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-rpg text-white tracking-wide flex items-center gap-2">
              <span className="text-gold">⚔</span>
              Minhas Guildas
            </h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gold hover:bg-gold-light text-dark px-5 py-2.5 rounded font-serif font-bold tracking-wide transition-all hover-lift flex items-center gap-2"
            >
              <span className="text-lg">+</span>
              Nova Guilda
            </button>
          </div>

          {loadingGuilds ? (
            <div className="text-center py-16">
              <div className="text-gold font-serif italic animate-pulse">
                Carregando guildas...
              </div>
            </div>
          ) : guilds.length === 0 ? (
            <div className="border-2 border-dashed border-gold/20 rounded-lg p-16 text-center">
              <div className="text-7xl mb-6 opacity-50">🏰</div>
              <h3 className="text-2xl font-rpg text-white mb-3">
                Forme sua primeira Guilda
              </h3>
              <p className="text-gray-400 font-serif mb-8 max-w-md mx-auto leading-relaxed">
                Convide seus amigos para avaliar sistemas de RPG juntos e
                descobrir qual é o favorito da mesa
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gold hover:bg-gold-light text-dark px-8 py-3 rounded font-serif font-bold tracking-wide transition-all hover-lift"
              >
                Criar Primeira Guilda
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {guilds.map((guild, index) => (
                <div
                  key={guild.id}
                  className="guild-scroll border border-gold/15 hover:border-gold/40 rounded-lg p-6 transition-all hover-lift group"
                  style={{ animationDelay: `${0.35 + index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-rpg text-white group-hover:text-gold transition-colors tracking-wide">
                          {guild.name}
                        </h3>
                        {guild.admin.id === user.id && (
                          <span className="bg-gold text-dark text-xs font-serif font-bold px-2 py-1 rounded">
                            GM
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 font-serif">
                        {guild._count.members}{" "}
                        {guild._count.members === 1 ? "membro" : "membros"}
                      </p>
                    </div>
                    <div className="w-14 h-14 rounded border-2 border-gold/30 bg-linear-to-br from-primary to-primary-light flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                      🏰
                    </div>
                  </div>

                  <div className="border-t border-gold/10 pt-5 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-serif mb-1">
                        Votações Ativas
                      </p>
                      <p className="text-3xl font-rpg text-gold">
                        {guild._count.votingSessions}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/guilds/${guild.id}`)}
                        className="bg-primary hover:bg-primary-light text-white px-5 py-2.5 rounded font-serif font-semibold tracking-wide transition-colors"
                      >
                        Entrar
                      </button>
                      {guild.admin.id === user.id && (
                        <button
                          onClick={() =>
                            handleDeleteGuild(guild.id, guild.name)
                          }
                          className="bg-dark-lighter hover:bg-red-900/30 border border-red-900/40 hover:border-red-600/60 text-red-400 px-3 py-2.5 rounded transition-all"
                          title="Deletar guilda"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Activity Feed - Campaign Journal */}
        <section
          className={`pb-12 ${mounted ? "reveal-stagger" : "opacity-0"}`}
          style={{ animationDelay: "0.4s" }}
        >
          <h2 className="text-2xl font-rpg text-white mb-6 tracking-wide flex items-center gap-2">
            <span className="text-gold">📜</span>
            Registro de Atividade
          </h2>
          <div className="border border-gold/10 rounded-lg bg-dark-lighter/30 backdrop-blur-sm">
            <div className="p-12 text-center">
              <div className="text-5xl mb-4 opacity-30">⚅</div>
              <p className="text-gray-500 font-serif italic">
                Nenhuma atividade registrada ainda
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Create Guild Modal - Parchment Style */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-dark border-2 border-gold/30 rounded-xl p-8 max-w-lg w-full relative guild-scroll">
            {/* Decorative corners */}
            <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-gold/50" />
            <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-gold/50" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-gold/50" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-gold/50" />

            <h3 className="text-3xl font-rpg text-gold mb-2 text-center tracking-wide">
              Formar Nova Guilda
            </h3>
            <p className="text-sm text-gray-500 font-serif italic text-center mb-8">
              Escolha um nome digno para sua companhia de aventureiros
            </p>

            <form onSubmit={handleCreateGuild} className="space-y-6">
              <div>
                <label className="block text-sm font-serif font-semibold text-gold mb-3 tracking-wide">
                  Nome da Guilda
                </label>
                <input
                  type="text"
                  value={newGuildName}
                  onChange={(e) => setNewGuildName(e.target.value)}
                  className="w-full px-5 py-3.5 bg-dark-lighter border-2 border-gold/30 focus:border-gold rounded-lg text-white placeholder-gray-600 focus:outline-none font-serif transition-colors"
                  placeholder="Ex: Cavaleiros da Mesa Redonda"
                  disabled={creatingGuild}
                  autoFocus
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewGuildName("");
                  }}
                  className="flex-1 bg-dark-lighter border-2 border-gold/20 hover:border-gold/40 text-gray-400 hover:text-white font-serif font-semibold py-3.5 rounded-lg transition-all"
                  disabled={creatingGuild}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gold hover:bg-gold-light text-dark font-serif font-bold py-3.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={creatingGuild}
                >
                  {creatingGuild ? "Formando..." : "Criar Guilda"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
