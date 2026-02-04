import { NextResponse } from 'next/server';

export async function GET() {
  // Simulate a failing health check for testing rollback
  return NextResponse.json(
    { 
      status: 'unhealthy', 
      timestamp: new Date().toISOString(),
      error: 'Simulated deployment failure - health check failing'
    },
    { status: 503 }
  );
}
