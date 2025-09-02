const request = require('supertest');

// Prismaクライアントのモック
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

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrismaClient),
}));

describe('Users API', () => {
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

  describe('GET /api/users', () => {
    it('should return all users successfully', async () => {
      const mockUsers = [
        { id: 1, username: 'admin', email: 'admin@example.com', createdAt: new Date() },
        { id: 2, username: 'user1', email: 'user1@example.com', createdAt: new Date() }
      ];

      mockPrismaClient.user.findMany.mockResolvedValue(mockUsers);

      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body).toEqual({ users: mockUsers });
      expect(mockPrismaClient.user.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true
        }
      });
    });

    it('should return 500 when database query fails', async () => {
      mockPrismaClient.user.findMany.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/users')
        .expect(500);

      expect(response.body).toEqual({ error: 'Failed to fetch users' });
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user successfully', async () => {
      const newUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const createdUser = {
        id: 3,
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: 'password123'
      };

      mockPrismaClient.user.create.mockResolvedValue(createdUser);

      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(200);

      expect(response.body).toEqual({
        message: 'User created successfully',
        userId: 3
      });

      expect(mockPrismaClient.user.create).toHaveBeenCalledWith({
        data: {
          username: 'testuser',
          email: 'test@example.com',
          passwordHash: 'password123'
        }
      });
    });

    it('should return 400 when required fields are missing', async () => {
      const incompleteUser = {
        username: 'testuser'
        // email and password missing
      };

      const response = await request(app)
        .post('/api/users')
        .send(incompleteUser)
        .expect(400);

      expect(response.body).toEqual({ error: 'Missing required fields' });
    });

    it('should return 409 when username or email already exists', async () => {
      const newUser = {
        username: 'admin',
        email: 'admin@example.com',
        password: 'password123'
      };

      const duplicateError = new Error('Duplicate entry');
      duplicateError.code = 'P2002';

      mockPrismaClient.user.create.mockRejectedValue(duplicateError);

      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(409);

      expect(response.body).toEqual({ error: 'Username or email already exists' });
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user successfully', async () => {
      const userId = 1;
      const updateData = {
        username: 'updateduser',
        email: 'updated@example.com'
      };

      const updatedUser = {
        id: 1,
        username: 'updateduser',
        email: 'updated@example.com',
        createdAt: new Date()
      };

      mockPrismaClient.user.update.mockResolvedValue(updatedUser);

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toEqual({
        message: 'User updated successfully',
        user: {
          id: 1,
          username: 'updateduser',
          email: 'updated@example.com',
          createdAt: expect.any(Date)
        }
      });

      expect(mockPrismaClient.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData
      });
    });

    it('should return 404 when user not found', async () => {
      const userId = 999;
      const updateData = {
        username: 'updateduser',
        email: 'updated@example.com'
      };

      const notFoundError = new Error('User not found');
      notFoundError.code = 'P2025';

      mockPrismaClient.user.update.mockRejectedValue(notFoundError);

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toEqual({ error: 'User not found' });
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete user successfully', async () => {
      const userId = 1;

      mockPrismaClient.user.delete.mockResolvedValue({ id: 1 });

      const response = await request(app)
        .delete(`/api/users/${userId}`)
        .expect(200);

      expect(response.body).toEqual({ message: 'User deleted successfully' });

      expect(mockPrismaClient.user.delete).toHaveBeenCalledWith({
        where: { id: 1 }
      });
    });

    it('should return 404 when user not found', async () => {
      const userId = 999;

      const notFoundError = new Error('User not found');
      notFoundError.code = 'P2025';

      mockPrismaClient.user.delete.mockRejectedValue(notFoundError);

      const response = await request(app)
        .delete(`/api/users/${userId}`)
        .expect(404);

      expect(response.body).toEqual({ error: 'User not found' });
    });
  });
});
