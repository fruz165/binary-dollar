import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

// In-memory storage for demo (use database in production)
const tokens: Map<string, any> = new Map()

// Initialize with demo token
if (tokens.size === 0) {
  const demoToken = {
    id: crypto.randomUUID(),
    token: `bd_${crypto.randomBytes(32).toString("hex")}`,
    name: "Demo Token",
    createdAt: new Date().toISOString(),
    isActive: true,
  }
  tokens.set(demoToken.token, demoToken)
}

export async function GET() {
  try {
    const tokenList = Array.from(tokens.values()).map((token) => ({
      ...token,
      token: `${token.token.substring(0, 8)}...${token.token.substring(token.token.length - 4)}`,
    }))

    return NextResponse.json({
      success: true,
      tokens: tokenList,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch tokens" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()

    if (!name || typeof name !== "string") {
      return NextResponse.json({ success: false, error: "Token name is required" }, { status: 400 })
    }

    const tokenId = crypto.randomUUID()
    const token = `bd_${crypto.randomBytes(32).toString("hex")}`

    const newToken = {
      id: tokenId,
      token,
      name,
      createdAt: new Date().toISOString(),
      isActive: true,
    }

    tokens.set(token, newToken)

    return NextResponse.json({
      success: true,
      message: "Binary Dollar API token created successfully",
      token: newToken,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create token" }, { status: 500 })
  }
}