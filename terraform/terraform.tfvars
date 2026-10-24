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

container_cpu = "256"
container_memory = "512"
server_cpu = "512"
server_memory = "1024"
