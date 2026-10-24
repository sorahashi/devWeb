#!/usr/bin/env bash
set -euo pipefail

AWS_REGION="${AWS_REGION:-ap-northeast-1}"
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID:?Please set AWS_ACCOUNT_ID before running this script}"
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

CLIENT_REPO="devweb-client"
SERVER_REPO="devweb-server"
CLIENT_IMAGE="${ECR_REGISTRY}/${CLIENT_REPO}:latest"
SERVER_IMAGE="${ECR_REGISTRY}/${SERVER_REPO}:latest"

echo "[1/5] Login to ECR"
aws ecr get-login-password --region "${AWS_REGION}" | docker login --username AWS --password-stdin "${ECR_REGISTRY}"

echo "[2/5] Create ECR repositories if necessary"
aws ecr describe-repositories --repository-names "${CLIENT_REPO}" --region "${AWS_REGION}" >/dev/null 2>&1 || aws ecr create-repository --repository-name "${CLIENT_REPO}" --region "${AWS_REGION}" >/dev/null
aws ecr describe-repositories --repository-names "${SERVER_REPO}" --region "${AWS_REGION}" >/dev/null 2>&1 || aws ecr create-repository --repository-name "${SERVER_REPO}" --region "${AWS_REGION}" >/dev/null

echo "[3/5] Build and push client image"
docker build -f client/Dockerfile.prod -t "${CLIENT_REPO}:latest" ./client
docker tag "${CLIENT_REPO}:latest" "${CLIENT_IMAGE}"
docker push "${CLIENT_IMAGE}"

echo "[4/5] Build and push server image"
docker build -f server/Dockerfile.prod -t "${SERVER_REPO}:latest" ./server
docker tag "${SERVER_REPO}:latest" "${SERVER_IMAGE}"
docker push "${SERVER_IMAGE}"

echo "[5/5] Register ECS task definitions"
aws ecs register-task-definition --region "${AWS_REGION}" --cli-input-json file://aws/ecs/client-task-definition.json >/dev/null
aws ecs register-task-definition --region "${AWS_REGION}" --cli-input-json file://aws/ecs/server-task-definition.json >/dev/null

echo "Deployment images pushed and ECS task definitions registered."
echo "Next steps:"
echo "  1. Create ECS cluster: devweb-cluster"
echo "  2. Create ALB and target groups"
echo "  3. Create client/server services using the registered task definitions"
echo "  4. Set DATABASE_URL and CORS_ORIGIN in ECS secrets or environment variables"
