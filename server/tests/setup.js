// テスト用の環境変数を設定
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'mysql://webapp_user:webapp_password@localhost:3306/webapp_test_db';

// Prismaクライアントのモック設定
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $queryRaw: jest.fn(),
    $disconnect: jest.fn(),
  };
  
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

// テスト用のグローバル設定
global.console = {
  ...console,
  // テスト中のログ出力を抑制
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
