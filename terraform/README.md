# Terraform deployment for AWS ECS / Fargate

This directory provisions the infrastructure required for the devWeb repository on AWS.

## What this creates

- VPC and public/private subnets
- Internet Gateway and route tables
- ECR repositories for frontend and backend images
- ALB with routing rules
- ECS Fargate cluster and services
- RDS MySQL database
- Secrets Manager secret for DATABASE_URL
- CloudWatch log groups

## Prerequisites

- AWS CLI installed and configured
- Terraform v1.5 or newer
- IAM permissions for VPC, ECS, ALB, ECR, RDS, Secrets Manager, and CloudWatch Logs
- Docker installed for building and pushing container images

## 1. Edit terraform.tfvars

Use the provided `terraform.tfvars` file as the starting point and replace values with your real environment values.

Example:

```hcl
aws_region = "ap-northeast-1"
project_name = "devweb"
environment = "prod"

vpc_cidr = "10.0.0.0/16"
public_subnet_cidrs = ["10.0.1.0/24", "10.0.2.0/24"]
private_subnet_cidrs = ["10.0.11.0/24", "10.0.12.0/24"]
availability_zones = ["ap-northeast-1a", "ap-northeast-1c"]

db_name = "webapp_db"
db_username = "admin"
db_password = "SetYourStrongPassword123!"

frontend_domain = "example.com"
api_domain = "api.example.com"
```

Important:
- Do not commit real production secrets to Git.
- Use a secure DB password in a real deployment.
- Replace `example.com` with your actual public domain.

## 2. Initialize Terraform

```bash
cd terraform
terraform init
```

## 3. Preview the infrastructure

```bash
terraform plan
```

## 4. Apply the infrastructure

```bash
terraform apply
```

This will create:
- VPC and networking
- ECR repos
- ALB and target groups
- ECS cluster
- RDS MySQL
- database URL secret
- cloud logs

## 5. Build and push the Docker images

Set your AWS account ID and region, then run:

```bash
export AWS_ACCOUNT_ID=123456789012
export AWS_REGION=ap-northeast-1
bash ../scripts/deploy-aws-ecs.sh
```

The script will:
- log in to ECR
- create ECR repositories if needed
- build the client image
- build the server image
- push both images
- register ECS task definitions

## 6. Create ECS services

After Terraform applies, create the ECS services manually using the task definitions that were registered.

Recommended names:
- `devweb-prod-client`
- `devweb-prod-server`

Use the registered task definitions:
- `devweb-prod-client`
- `devweb-prod-server`

Set the following network settings:
- Client service: public subnets, public IP enabled, security group `devweb-prod-client-sg`
- Server service: public subnets, public IP enabled, security group `devweb-prod-server-sg`

Attach the ALB target groups:
- client target group -> port 4173
- server target group -> port 3000

## 7. Connect the frontend to the correct API URL

The frontend is built using `VITE_API_URL`.

For a production deployment, set the value to the public API URL, for example:

```bash
https://api.example.com
```

If you are routing via ALB, the API path is usually:

```bash
http://<alb-dns-name>/api
```

## 8. Configure the application domain

Set the actual domain values for:
- `frontend_domain`
- `api_domain`
- `CORS_ORIGIN`
- `VITE_API_URL`

Then redeploy the services.

## 9. Run Prisma migration once on the server

After the server is running, use the container shell or ECS Exec to run:

```bash
npx prisma migrate deploy
```

## 10. Verify deployment

Check the ALB DNS name:

```bash
terraform output
```

Then confirm:
- frontend loads on the ALB DNS name
- API health check works: `http://<alb-dns-name>/health`
- user endpoints work: `http://<alb-dns-name>/api/users`

## Notes

- The database is created in a private subnet and is only reachable from the server service's security group.
- For production, do not leave `db_password` in Git.
- If you use a custom domain, configure Route 53 and HTTPS termination through ALB.
- Store production secrets in AWS Secrets Manager or SSM Parameter Store instead of plain environment files.

## Recommended final architecture

- Frontend: ECS Fargate + ALB public endpoint
- Backend: ECS Fargate + ALB routing to /api and /health
- Database: RDS MySQL in private subnets
- Secrets: Secrets Manager

This is the recommended AWS deployment shape for this repository.
