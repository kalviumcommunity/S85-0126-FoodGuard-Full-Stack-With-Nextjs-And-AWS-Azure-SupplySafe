import { NextRequest, NextResponse } from 'next/server';
import { logger, Logger } from '@/lib/logger';

export function withLogging(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now();
    const requestId = Logger.generateRequestId();
    const url = req.url;
    const method = req.method;

    // Log incoming request
    logger.logApiRequest(method, url, requestId, {
      userAgent: req.headers.get('user-agent'),
      ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
    });

    try {
      // Execute the original handler
      const response = await handler(req);

      // Calculate response time
      const responseTime = Date.now() - startTime;

      // Log successful response
      logger.logApiResponse(method, url, response.status, requestId, responseTime, {
        contentType: response.headers.get('content-type'),
      });

      // Add request ID to response headers for debugging
      response.headers.set('x-request-id', requestId);

      return response;
    } catch (error) {
      // Calculate response time for error case
      const responseTime = Date.now() - startTime;

      // Log error response
      logger.logApiResponse(method, url, 500, requestId, responseTime, {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      // Re-throw the error to let Next.js handle it
      throw error;
    }
  };
}
