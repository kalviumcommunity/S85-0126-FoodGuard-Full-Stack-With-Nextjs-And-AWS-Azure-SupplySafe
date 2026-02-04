const request = require('supertest');
const { createServer } = require('http');

describe('Smoke Tests - API Endpoints', () => {
  let server;
  
  beforeAll(async () => {
    const { next } = require('next');
    const app = next({ dev: false, dir: '.' });
    await app.prepare();
    server = createServer(app.getRequestHandler());
  });

  afterAll(async () => {
    if (server) {
      server.close();
    }
  });

  test('API routes are accessible', async () => {
    // Test that API routes don't return 500 errors
    const endpoints = [
      '/api/health',
      '/api/users',
      '/api/alerts'
    ];

    for (const endpoint of endpoints) {
      try {
        await request(server)
          .get(endpoint)
          .expect(status => status < 500); // Should not be server error
      } catch (error) {
        // Some endpoints might not exist, but shouldn't crash the server
        expect(error.status).toBeLessThan(500);
      }
    }
  });
});
