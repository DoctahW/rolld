import { NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/auth/middleware";
import { getGuildById, isUserInGuild } from "@/lib/guilds/queries";
import { prisma } from "@/lib/db/prisma";

async function getGuildHandler(
  request: AuthenticatedRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const guild = await getGuildById(id);

    if (!guild) {
      return NextResponse.json(
        { error: "Guilda não encontrada" },
        { status: 404 },
      );
    }

    if (!isUserInGuild(guild, request.user!.userId)) {
      return NextResponse.json(
        { error: "Você não tem acesso a essa guilda" },
        { status: 403 },
      );
    }

    return NextResponse.json({ guild });
  } catch (error) {
    console.error("Erro ao buscar guilda:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

async function deleteGuildHandler(
  request: AuthenticatedRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const guild = await prisma.guild.findUnique({
      where: { id },
    });

    if (!guild) {
      return NextResponse.json(
        { error: "Guilda não encontrada" },
        { status: 404 },
      );
    }

    if (guild.adminId !== request.user!.userId) {
      return NextResponse.json(
        { error: "Apenas o admin pode deletar a guilda" },
        { status: 403 },
      );
    }

    await prisma.guildMember.deleteMany({
      where: { guildId: id },
    });

    await prisma.guild.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Guilda deletada com sucesso",
    });
  } catch (error) {
    console.error("Erro ao deletar guilda:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

export const GET = withAuth(getGuildHandler);
export const DELETE = withAuth(deleteGuildHandler);
