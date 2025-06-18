import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json({ success: false, error: "API token required" }, { status: 401 })
    }

    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate occasional connection failures for realism
    if (Math.random() < 0.1) {
      throw new Error("Connection failed")
    }

    return NextResponse.json({
      success: true,
      message: "Connected to Binary Dollar server successfully",
      timestamp: new Date().toISOString(),
      serverStatus: "online",
      authenticatedAs: "Demo User",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to connect to Binary Dollar",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}