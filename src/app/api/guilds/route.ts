import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifyToken } from "@/lib/auth/jwt";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Não autorizado!" }, { status: 401 });
    }

    const payload = verifyToken(token);
    const guilds = await prisma.guild.findMany({
      where: {
        OR: [
          { adminId: payload.userId },
          {
            members: {
              some: {
                userId: payload.userId,
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
    return NextResponse.json({ guilds });
  } catch (error) {
    console.error("Erro ao listar guildas:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor!" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Não autorizado!" }, { status: 401 });
    }

    const payload = verifyToken(token);
    const body = await request.json();
    const { name } = body;

    const guild = await prisma.guild.create({
      data: {
        name: name.trim(),
        adminId: payload.userId,
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
        userId: payload.userId,
        guildId: guild.id,
        status: "accepted",
      },
    });

    return NextResponse.json(
      {
        message: "Guilda criada com sucesso!",
        guild,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erro ao criar guilda:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor!" },
      { status: 500 },
    );
  }
}
