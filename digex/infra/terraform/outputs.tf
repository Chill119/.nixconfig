output "vpc_id" {
  value       = aws_vpc.digex.id
  description = "DIGEX VPC ID"
}

output "ecs_cluster_name" {
  value       = aws_ecs_cluster.digex.name
  description = "ECS cluster name"
}

output "bridge_service_name" {
  value       = aws_ecs_service.bridge_core.name
  description = "Bridge core ECS service name"
}
