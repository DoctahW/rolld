"use client";

import { useRouter } from "next/navigation";

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

interface GuildCardProps {
  guild: Guild;
  currentUserId: string;
  onDelete: (guildId: string, guildName: string) => void;
}

export function GuildCard({ guild, currentUserId, onDelete }: GuildCardProps) {
  const router = useRouter();
  const isAdmin = guild.admin.id === currentUserId;

  return (
    <div className="bg-dark-lighter border border-primary/30 hover:border-gold/50 rounded-lg p-6 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-white group-hover:text-gold transition-colors">
              {guild.name}
            </h3>
            {isAdmin && (
              <span className="bg-gold text-dark text-xs font-bold px-2 py-0.5 rounded">
                ADMIN
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400">
            {guild._count.members} membros
          </p>
        </div>
        <div className="w-12 h-12 bg-linear-to-br from-primary to-primary-light rounded-lg flex items-center justify-center text-white text-xl">
          🏰
        </div>
      </div>

      <div className="border-t border-primary/20 pt-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-400">Votações Ativas</p>
          <p className="text-2xl font-bold text-white">
            {guild._count.votingSessions}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/guilds/${guild.id}`)}
            className="bg-primary hover:bg-primary-light text-white text-sm font-medium px-4 py-2 rounded transition-colors"
          >
            Acessar
          </button>
          {isAdmin && (
            <button
              onClick={() => onDelete(guild.id, guild.name)}
              className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-3 py-2 rounded transition-colors"
              title="Deletar guilda"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
