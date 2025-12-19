import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth/jwt";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  console.log("🔵 Proxy rodando:", pathname, "Token:", !!token);

  // Rotas públicas (não precisam de auth)
  const publicRoutes = ["/", "/auth"];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Se está tentando acessar rota protegida sem token
  if (!isPublicRoute && !token) {
    console.log("🔴 Sem token, redirecionando para /auth");
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // Se tem token, verifica se é válido
  if (token) {
    try {
      verifyToken(token);
      console.log("✅ Token válido");

      // Se está logado e tenta acessar /auth, redireciona pro dashboard
      if (pathname === "/auth") {
        console.log("🔵 Já logado, redirecionando para /dashboard");
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (error) {
      console.log("❌ Token inválido:", error);
      // Token inválido ou expirado
      const response = NextResponse.redirect(new URL("/auth", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  console.log("✅ Proxy liberou acesso");
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
