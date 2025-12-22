import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@/generated/client";

// Tipo da guilda com includes
type GuildWithRelations = Prisma.GuildGetPayload<{
  include: {
    admin: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
    members: {
      include: {
        user: {
          select: {
            id: true;
            name: true;
            email: true;
          };
        };
      };
    };
    votingSessions: {
      include: {
        system: true;
        _count: {
          select: {
            votes: true;
          };
        };
      };
    };
  };
}>;

// Tipo do membro da guilda
type GuildMemberWithUser = Prisma.GuildMemberGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
  };
}>;

export async function getGuildById(guildId: string) {
  return prisma.guild.findUnique({
    where: { id: guildId },
    include: {
      admin: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      votingSessions: {
        include: {
          system: true,
          _count: {
            select: {
              votes: true,
            },
          },
        },
      },
    },
  });
}

export async function getUserGuilds(userId: string) {
  return prisma.guild.findMany({
    where: {
      OR: [
        { adminId: userId },
        {
          members: {
            some: {
              userId: userId,
              status: "accepted",
            },
          },
        },
      ],
    },
    include: {
      admin: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      members: {
        where: {
          status: "accepted",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      _count: {
        select: {
          members: true,
          votingSessions: true,
        },
      },
    },
  });
}

export function isUserInGuild(
  guild: GuildWithRelations,
  userId: string,
): boolean {
  const isMember = guild.members.some(
    (m: GuildMemberWithUser) => m.userId === userId && m.status === "accepted",
  );
  const isAdmin = guild.adminId === userId;

  return isMember || isAdmin;
}
