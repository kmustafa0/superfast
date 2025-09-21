import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Basic health check
    const healthStatus = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      version: "1.0.0",
    };

    return NextResponse.json(healthStatus, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: `Health check failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
      },
      { status: 503 }
    );
  }
}
