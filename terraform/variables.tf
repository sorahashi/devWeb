variable "aws_region" {
  description = "AWS region for the deployment"
  type        = string
  default     = "ap-northeast-1"
}

variable "aws_profile" {
  description = "AWS profile name to use for credentials (optional)"
  type        = string
  default     = null
}

variable "project_name" {
  description = "Project name used for naming AWS resources"
  type        = string
  default     = "devweb"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "prod"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.0.11.0/24", "10.0.12.0/24"]
}

variable "availability_zones" {
  description = "Availability zones to use"
  type        = list(string)
  default     = ["ap-northeast-1a", "ap-northeast-1c"]
}

variable "db_name" {
  description = "MySQL database name"
  type        = string
  default     = "webapp_db"
}

variable "db_username" {
  description = "Master username for the RDS MySQL instance"
  type        = string
  default     = "admin"
}

variable "db_password" {
  description = "Master password for the RDS MySQL instance"
  type        = string
  sensitive   = true
  default     = "ChangeMe123!"
}

variable "frontend_domain" {
  description = "Public frontend domain for CORS and API URLs"
  type        = string
  default     = "example.com"
}

variable "api_domain" {
  description = "API domain used by the frontend"
  type        = string
  default     = "api.example.com"
}

variable "container_cpu" {
  description = "CPU units for ECS tasks"
  type        = string
  default     = "256"
}

variable "container_memory" {
  description = "Memory for ECS tasks"
  type        = string
  default     = "512"
}

variable "server_cpu" {
  description = "CPU units for server task"
  type        = string
  default     = "512"
}

variable "server_memory" {
  description = "Memory for server task"
  type        = string
  default     = "1024"
}
