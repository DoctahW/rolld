"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { VotingSession } from "@/generated";
import Header from "@/components/Header";

interface User {
  id: string;
  name: string;
  email: string;
}

interface GuildMember {
  id: string;
  status: string;
  user: User;
}

interface Guild {
  id: string;
  name: string;
  admin: User;
  members: GuildMember[];
  votingSessions: VotingSession[];
  _count: {
    members: number;
    votingSessions: number;
  };
}

export default function GuildDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [guildId, setGuildId] = useState<string | null>(null);
  const [guild, setGuild] = useState<Guild | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    params.then((p) => setGuildId(p.id));
  }, [params]);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
    }
  }, []);

  useEffect(() => {
    if (guildId) {
      loadGuild();
    }
  }, [guildId]);

  async function loadGuild() {
    if (!guildId) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/guilds/${guildId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || "Erro ao carregar guilda");
        router.push("/dashboard");
        return;
      }

      const data = await response.json();
      setGuild(data.guild);
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao carregar guilda");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();

    if (!inviteEmail.trim()) {
      toast.error("Email é obrigatório");
      return;
    }

    setInviting(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/guilds/${guildId}/invite`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: inviteEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Erro ao enviar convite");
        return;
      }

      toast.success("Convite enviado com sucesso!");
      setInviteEmail("");
      setShowInviteModal(false);
      loadGuild();
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao enviar convite");
    } finally {
      setInviting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-white text-xl">Carregando guilda...</div>
      </div>
    );
  }

  if (!guild || !currentUser) {
    return null;
  }

  const isAdmin = guild.admin.id === currentUser.id;
  const acceptedMembers = guild.members.filter((m) => m.status === "accepted");
  const pendingMembers = guild.members.filter((m) => m.status === "pending");

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <Header
        user={currentUser}
        guildContext={{
          guildName: guild.name,
          isAdmin: isAdmin,
          onInviteClick: () => setShowInviteModal(true),
        }}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Info da Guilda */}
          <aside className="lg:col-span-1">
            <div className="bg-dark-lighter border border-primary/20 rounded-lg p-6 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gold mb-3">Admin</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-linear-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white font-bold">
                    {guild.admin.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-white font-medium">
                      {guild.admin.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {guild.admin.email}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-primary/20 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Membros</span>
                  <span className="text-white font-medium">
                    {acceptedMembers.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Convites Pendentes</span>
                  <span className="text-white font-medium">
                    {pendingMembers.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Votações Ativas</span>
                  <span className="text-white font-medium">
                    {guild._count.votingSessions}
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Membros */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4">
                Membros ({acceptedMembers.length})
              </h2>

              {acceptedMembers.length === 0 ? (
                <div className="bg-dark-lighter border border-primary/20 rounded-lg p-8 text-center">
                  <p className="text-gray-400">Nenhum membro ainda</p>
                </div>
              ) : (
                <div className="bg-dark-lighter border border-primary/20 rounded-lg divide-y divide-primary/10">
                  {acceptedMembers.map((member) => (
                    <div
                      key={member.id}
                      className="p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white font-bold">
                          {member.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            {member.user.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {member.user.email}
                          </div>
                        </div>
                      </div>
                      {member.user.id === guild.admin.id && (
                        <span className="bg-gold text-dark text-xs font-bold px-2 py-1 rounded">
                          ADMIN
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Convites Pendentes (só admin vê) */}
            {isAdmin && pendingMembers.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-white mb-4">
                  Convites Pendentes ({pendingMembers.length})
                </h2>
                <div className="bg-dark-lighter border border-primary/20 rounded-lg divide-y divide-primary/10">
                  {pendingMembers.map((member) => (
                    <div
                      key={member.id}
                      className="p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold">
                          {member.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            {member.user.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {member.user.email}
                          </div>
                        </div>
                      </div>
                      <span className="bg-yellow-500 text-dark text-xs font-bold px-2 py-1 rounded">
                        PENDENTE
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Votações */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Votações</h2>
                {isAdmin && (
                  <button className="bg-primary hover:bg-primary-light text-white text-sm font-bold px-4 py-2 rounded transition-colors">
                    + Nova Votação
                  </button>
                )}
              </div>

              <div className="bg-dark-lighter border border-primary/20 rounded-lg p-8 text-center">
                <div className="text-5xl mb-3">🗳️</div>
                <p className="text-gray-400">Nenhuma votação ainda</p>
                {isAdmin && (
                  <button className="mt-4 bg-primary hover:bg-primary-light text-white text-sm font-medium px-6 py-2 rounded transition-colors">
                    Criar Primeira Votação
                  </button>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Modal de Convidar */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-lighter border-2 border-primary/30 rounded-xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-6">
              Convidar Membro
            </h3>

            <form onSubmit={handleInvite} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gold mb-2">
                  Email do Usuário
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-dark border-2 border-primary/30 focus:border-gold rounded-lg text-white placeholder-gray-500 focus:outline-none"
                  placeholder="usuario@email.com"
                  disabled={inviting}
                  autoFocus
                />
                <p className="text-xs text-gray-400 mt-2">
                  O usuário deve estar cadastrado no Rolld
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteEmail("");
                  }}
                  className="flex-1 bg-dark border border-primary/30 hover:border-primary text-white font-bold py-3 rounded-lg transition-all"
                  disabled={inviting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gold hover:bg-gold-light text-dark font-bold py-3 rounded-lg transition-all disabled:opacity-50"
                  disabled={inviting}
                >
                  {inviting ? "Enviando..." : "Enviar Convite"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
