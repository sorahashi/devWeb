const fastify = require('fastify')({ logger: true });
const { PrismaClient } = require('@prisma/client');

// Prismaクライアントの初期化
const prisma = new PrismaClient();

// プラグインを登録
fastify.register(require('@fastify/cors'), {
  origin: true,
  credentials: true
});

fastify.register(require('@fastify/helmet'));

// ヘルスチェックエンドポイント
fastify.get('/health', async (request, reply) => {
  try {
    await prisma.$queryRaw`SELECT 1 as status`;
    return { status: 'ok', database: 'connected', timestamp: new Date().toISOString() };
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({ status: 'error', message: 'Database connection failed' });
  }
});

// ユーザー一覧取得エンドポイント
fastify.get('/api/users', async (request, reply) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true
      }
    });
    return { users };
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({ error: 'Failed to fetch users' });
  }
});

// ユーザー作成エンドポイント
fastify.post('/api/users', async (request, reply) => {
  try {
    const { username, email, password } = request.body;
    
    if (!username || !email || !password) {
      return reply.status(400).send({ error: 'Missing required fields' });
    }

    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: password // 実際のアプリではパスワードをハッシュ化する
      }
    });

    return { 
      message: 'User created successfully', 
      userId: user.id 
    };
  } catch (error) {
    fastify.log.error(error);
    if (error.code === 'P2002') {
      return reply.status(409).send({ error: 'Username or email already exists' });
    }
    return reply.status(500).send({ error: 'Failed to create user' });
  }
});

// ユーザー更新エンドポイント
fastify.put('/api/users/:id', async (request, reply) => {
  try {
    const { id } = request.params;
    const { username, email } = request.body;
    
    if (!username || !email) {
      return reply.status(400).send({ error: 'Missing required fields' });
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { username, email }
    });

    return { 
      message: 'User updated successfully', 
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      }
    };
  } catch (error) {
    fastify.log.error(error);
    if (error.code === 'P2025') {
      return reply.status(404).send({ error: 'User not found' });
    }
    if (error.code === 'P2002') {
      return reply.status(409).send({ error: 'Username or email already exists' });
    }
    return reply.status(500).send({ error: 'Failed to update user' });
  }
});

// ユーザー削除エンドポイント
fastify.delete('/api/users/:id', async (request, reply) => {
  try {
    const { id } = request.params;
    
    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    return { message: 'User deleted successfully' };
  } catch (error) {
    fastify.log.error(error);
    if (error.code === 'P2025') {
      return reply.status(404).send({ error: 'User not found' });
    }
    return reply.status(500).send({ error: 'Failed to delete user' });
  }
});

// パスワード更新エンドポイント
fastify.patch('/api/users/:id/password', async (request, reply) => {
  try {
    const { id } = request.params;
    const { password } = request.body;
    
    if (!password) {
      return reply.status(400).send({ error: 'Password is required' });
    }

    await prisma.user.update({
      where: { id: parseInt(id) },
      data: { passwordHash: password } // 実際のアプリではパスワードをハッシュ化する
    });

    return { message: 'Password updated successfully' };
  } catch (error) {
    fastify.log.error(error);
    if (error.code === 'P2025') {
      return reply.status(404).send({ error: 'User not found' });
    }
    return reply.status(500).send({ error: 'Failed to update password' });
  }
});

// アプリケーション作成関数（テスト用）
async function createApp() {
  // テスト用にログを無効化
  if (process.env.NODE_ENV === 'test') {
    fastify.log.level = 'silent';
  }
  
  // アプリケーションを準備（リッスンはしない）
  await fastify.ready();
  return fastify;
}

// サーバー起動（本番用）
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    fastify.log.info(`Server is running on port 3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// グレースフルシャットダウン
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// 本番環境でのみサーバーを起動
if (process.env.NODE_ENV !== 'test') {
  start();
}

module.exports = { createApp, start };
module.exports.default = createApp;
