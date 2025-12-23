import { NextRequest, NextResponse } from "next/server";
import { verifyToken, TokenPayload } from "./jwt";

export interface AuthenticatedRequest extends NextRequest {
  user?: TokenPayload;
}

export function withAuth<TContext = unknown>(
  handler: (
    request: AuthenticatedRequest,
    context: TContext,
  ) => Promise<NextResponse>,
) {
  return async (request: NextRequest, context: TContext) => {
    const authenticatedRequest = request as AuthenticatedRequest;

    try {
      const authHeader = authenticatedRequest.headers.get("Authorization");
      const token = authHeader?.replace("Bearer ", "");

      if (!token) {
        return NextResponse.json(
          { error: "Token não fornecido" },
          { status: 401 },
        );
      }

      const payload = verifyToken(token);
      authenticatedRequest.user = payload;

      return handler(authenticatedRequest, context);
    } catch (error) {
      return NextResponse.json(
        { error: "Token inválido ou expirado" },
        { status: 401 },
      );
    }
  };
}
