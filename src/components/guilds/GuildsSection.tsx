"use client";

import { GuildCard } from "./GuildCard";
import { GuildCardSkeleton } from "./GuildCardSkeleton";

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

interface GuildsSectionProps {
  guilds: Guild[];
  loading: boolean;
  currentUserId: string;
  onCreateClick: () => void;
  onDelete: (guildId: string, guildName: string) => void;
}

export function GuildsSection({
  guilds,
  loading,
  currentUserId,
  onCreateClick,
  onDelete,
}: GuildsSectionProps) {
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Minhas Guildas</h2>
        <button
          onClick={onCreateClick}
          className="bg-gold hover:bg-gold-light text-dark text-sm font-bold px-4 py-2 rounded transition-colors"
          disabled={loading}
        >
          + Nova Guilda
        </button>
      </div>

      {loading ? (
        // SKELETON LOADING
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GuildCardSkeleton />
          <GuildCardSkeleton />
        </div>
      ) : guilds.length === 0 ? (
        // EMPTY STATE
        <div className="border-2 border-dashed border-primary/30 rounded-lg p-12 text-center">
          <div className="text-6xl mb-4">🏰</div>
          <h3 className="text-xl font-bold text-white mb-2">
            Crie sua primeira Guilda
          </h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Convide seus amigos para avaliar sistemas de RPG juntos e descobrir
            qual é o favorito da mesa
          </p>
          <button
            onClick={onCreateClick}
            className="bg-gold hover:bg-gold-light text-dark text-sm font-bold px-6 py-3 rounded transition-colors"
          >
            Criar Guilda
          </button>
        </div>
      ) : (
        // LISTA DE GUILDAS
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guilds.map((guild) => (
            <GuildCard
              key={guild.id}
              guild={guild}
              currentUserId={currentUserId}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}
