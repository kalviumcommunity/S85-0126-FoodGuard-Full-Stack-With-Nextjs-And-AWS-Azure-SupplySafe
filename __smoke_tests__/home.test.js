const request = require('supertest');
const { createServer } = require('http');

describe('Smoke Tests - Home Page', () => {
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

  test('Home page loads successfully', async () => {
    const response = await request(server)
      .get('/')
      .expect(200);
    
    expect(response.text).toContain('SupplySafe');
  });

  test('Home page responds quickly', async () => {
    const start = Date.now();
    await request(server)
      .get('/')
      .expect(200);
    const duration = Date.now() - start;
    
    // Home page should load within 10 seconds
    expect(duration).toBeLessThan(10000);
  });
});
