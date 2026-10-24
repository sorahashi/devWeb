# Terraform deployment for demo and production

## Overview

This directory provisions the following AWS resources for this repo:

- VPC and subnets
- ECR repositories for client and server
- ALB + target groups + listeners
- ECS cluster and Fargate services
- MySQL RDS instance
- Secrets Manager for DATABASE_URL
- CloudWatch log groups

## prerequisites

- AWS CLI configured
- Terraform v1.5+
- An AWS account with permission to create VPC, ECS, ALB, RDS, ECR, and IAM

## Usage

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# edit terraform.tfvars with your values
terraform init
terraform plan
terraform apply
```

## Important notes

- The `frontent_domain` and `api_domain` values should match your actual public endpoints.
- `db_password` is sensitive and should be set via environment variable or secret manager when used for real deployment.
- After infrastructure creation, build and push the Docker images using the script in `scripts/deploy-aws-ecs.sh`

## Resulting app URLs

- frontend: `http://<alb-dns-name>`
- api: `http://<alb-dns-name>/api`

## After deployment

Run:

```bash
AWS_ACCOUNT_ID=123456789012 AWS_REGION=ap-northeast-1 bash scripts/deploy-aws-ecs.sh
```

This script builds the two Docker images and registers the ECS task definitions.
