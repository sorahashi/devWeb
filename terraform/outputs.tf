output "vpc_id" {
  value = aws_vpc.main.id
}

output "alb_dns_name" {
  value = aws_lb.main.dns_name
}

output "client_ecr_repository_url" {
  value = aws_ecr_repository.client.repository_url
}

output "server_ecr_repository_url" {
  value = aws_ecr_repository.server.repository_url
}

output "frontend_url" {
  value = "http://${aws_lb.main.dns_name}"
}

output "api_url" {
  value = "http://${aws_lb.main.dns_name}/api"
}

output "rds_endpoint" {
  value = aws_db_instance.main.address
}

output "database_secret_arn" {
  value = aws_secretsmanager_secret.database_url.arn
}
