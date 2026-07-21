process.env.NODE_ENV = 'test';
process.env.JWT_SECRET =
  'test-jwt-secret-that-is-longer-than-thirty-two-characters';
process.env.JWT_EXPIRES_IN = '15m';
process.env.DATABASE_URL =
  'postgresql://postgres:postgres@localhost:5432/kanban_test';
process.env.CLIENT_URL = 'http://localhost:5173';
process.env.API_PORT = '3001';
