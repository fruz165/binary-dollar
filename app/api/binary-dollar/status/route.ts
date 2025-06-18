import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  let authenticatedUser = null

  if (authHeader) {
    authenticatedUser = "Demo User"
  }

  return NextResponse.json({
    service: "Binary Dollar",
    version: "1.0.0",
    status: "operational",
    uptime: "99.9%",
    lastCheck: new Date().toISOString(),
    authenticated: !!authenticatedUser,
    user: authenticatedUser,
    services: {
      database: "online",
      api: "online",
      cdn: "online",
    },
  })
}