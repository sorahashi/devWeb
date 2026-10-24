# AWS ECS / Fargate deployment guide

This repository is now prepared for container deployment with ECS Fargate.

## Architecture

- Frontend: client container
- Backend API: server container
- Database: MySQL on RDS in production
- Public entrypoint: Application Load Balancer

## Why this repo matches ECS Fargate

- client is a SvelteKit Node app
- server is a Fastify API with Prisma
- both services are already containerized
- each service exposes a clear port

## Production-ready changes

- client uses @sveltejs/adapter-node for Node runtime in production
- server reads PORT/HOST/CORS_ORIGIN from environment
- Dockerfiles are split for production builds
- API CORS can be restricted by env without exposing all origins

## Recommended AWS setup

1. Create Amazon ECR repositories
   - devweb-client
   - devweb-server

2. Build and push images
   ```bash
   aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.ap-northeast-1.amazonaws.com

   docker build -f client/Dockerfile.prod -t devweb-client ./client
   docker tag devweb-client:latest <account>.dkr.ecr.ap-northeast-1.amazonaws.com/devweb-client:latest
   docker push <account>.dkr.ecr.ap-northeast-1.amazonaws.com/devweb-client:latest

   docker build -f server/Dockerfile.prod -t devweb-server ./server
   docker tag devweb-server:latest <account>.dkr.ecr.ap-northeast-1.amazonaws.com/devweb-server:latest
   docker push <account>.dkr.ecr.ap-northeast-1.amazonaws.com/devweb-server:latest
   ```

3. Create RDS MySQL instance
   - engine: MySQL 8.0
   - subnet/private access enabled
   - security group allows access from ECS tasks

4. Create ECS cluster and services
   - cluster: devweb-cluster
   - task definition: one task for client, one task for server
   - security groups:
     - client: allow 80/443 from ALB
     - server: allow 3000 from ALB and MySQL port from RDS security group

5. Create Application Load Balancer
   - listener 80 -> forward to client target group
   - listener 3000 or /api path -> forward to server target group

6. Configure environment variables
   ```env
   DATABASE_URL=mysql://user:password@rds-host:3306/dbname
   CORS_ORIGIN=https://example.com
   PORT=3000
   HOST=0.0.0.0
   ```

7. Run Prisma migration once on the server container
   ```bash
   npx prisma migrate deploy
   ```

## Important production notes

- Do not use localhost for database host in ECS
- Do not keep production secrets in git
- Store DATABASE_URL and CORS_ORIGIN in AWS Secrets Manager or SSM Parameter Store
- Use health checks for both services
- Keep client behind a public ALB and server private if possible

## Recommended final target

- client task: public-facing app container
- server task: private API container
- RDS MySQL: persistent data layer
- ALB: public entrypoint and routing

This is the cleanest ECS Fargate setup for this repository.
