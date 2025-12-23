import { NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/auth/middleware";
import { getUserGuilds } from "@/lib/guilds/queries";
import { prisma } from "@/lib/db/prisma";

async function getGuildsHandler(request: AuthenticatedRequest) {
  try {
    const guilds = await getUserGuilds(request.user!.userId);
    return NextResponse.json({ guilds });
  } catch (error) {
    console.error("Erro ao listar guildas:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

async function createGuildHandler(request: AuthenticatedRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Nome da guilda é obrigatório" },
        { status: 400 },
      );
    }

    const guild = await prisma.guild.create({
      data: {
        name: name.trim(),
        adminId: request.user!.userId,
      },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    await prisma.guildMember.create({
      data: {
        userId: request.user!.userId,
        guildId: guild.id,
        status: "accepted",
      },
    });

    return NextResponse.json(
      {
        message: "Guilda criada com sucesso",
        guild,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erro ao criar guilda:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

export const GET = withAuth(getGuildsHandler);
export const POST = withAuth(createGuildHandler);
