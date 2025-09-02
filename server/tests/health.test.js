const request = require('supertest');

// Prismaクライアントのモック
const mockPrismaClient = {
  $queryRaw: jest.fn(),
  $disconnect: jest.fn(),
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrismaClient),
}));

describe('Health Check API', () => {
  let app;

  beforeEach(async () => {
    // 各テスト前にモックをリセット
    jest.clearAllMocks();
    
    // アプリケーションをインポート（モック後に実行）
    const { createApp } = require('../src/app.js');
    app = await createApp();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('GET /health', () => {
    it('should return 200 and database connected status when database is healthy', async () => {
      // Prismaクエリが成功するようにモック
      mockPrismaClient.$queryRaw.mockResolvedValue([{ status: 1 }]);

      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toEqual({
        status: 'ok',
        database: 'connected',
        timestamp: expect.any(String)
      });

      expect(mockPrismaClient.$queryRaw).toHaveBeenCalledWith('SELECT 1 as status');
    });

    it('should return 500 when database connection fails', async () => {
      // Prismaクエリが失敗するようにモック
      mockPrismaClient.$queryRaw.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .get('/health')
        .expect(500);

      expect(response.body).toEqual({
        status: 'error',
        message: 'Database connection failed'
      });
    });
  });
});
