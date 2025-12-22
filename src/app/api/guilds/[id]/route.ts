import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";
import { getGuildById, isUserInGuild } from "@/lib/guilds/queries";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: "Token não fornecido" },
        { status: 401 },
      );
    }

    const payload = verifyToken(token);

    const guild = await getGuildById(id);

    if (!guild) {
      return NextResponse.json(
        { error: "Guilda não encontrada" },
        { status: 404 },
      );
    }

    if (!isUserInGuild(guild, payload.userId)) {
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
