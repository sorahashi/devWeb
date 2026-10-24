const fastify = require('fastify')({ logger: true });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '0.0.0.0';
const corsOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

fastify.register(require('@fastify/cors'), {
  origin: corsOrigins.length > 0 ? corsOrigins : true,
  credentials: true
});

fastify.register(require('@fastify/helmet'));

fastify.get('/health', async (request, reply) => {
  try {
    await prisma.$queryRaw`SELECT 1 as status`;
    return { status: 'ok', database: 'connected', timestamp: new Date().toISOString() };
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({ status: 'error', message: 'Database connection failed' });
  }
});

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
        passwordHash: password
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

fastify.patch('/api/users/:id/password', async (request, reply) => {
  try {
    const { id } = request.params;
    const { password } = request.body;

    if (!password) {
      return reply.status(400).send({ error: 'Password is required' });
    }

    await prisma.user.update({
      where: { id: parseInt(id) },
      data: { passwordHash: password }
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

const start = async () => {
  try {
    await fastify.listen({ port, host });
    fastify.log.info(`Server is running on ${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

start();
