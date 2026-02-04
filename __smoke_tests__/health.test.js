const request = require('supertest');
const { createServer } = require('http');

describe('Smoke Tests - Health Check', () => {
  let server;
  
  beforeAll(async () => {
    // Create a simple test server that proxies to the Next.js app
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

  test('Health endpoint returns 200 OK', async () => {
    const response = await request(server)
      .get('/api/health')
      .expect(200);
    
    expect(response.body).toHaveProperty('status', 'healthy');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
    expect(response.body).toHaveProperty('environment');
  });

  test('Health endpoint responds quickly', async () => {
    const start = Date.now();
    await request(server)
      .get('/api/health')
      .expect(200);
    const duration = Date.now() - start;
    
    // Health check should respond within 5 seconds
    expect(duration).toBeLessThan(5000);
  });
});
