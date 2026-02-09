variable "aws_region" {
  description = "AWS region to deploy DIGEX infrastructure"
  type        = string
  default     = "eu-west-2"
}

variable "aws_az" {
  description = "Availability zone for the primary subnet"
  type        = string
  default     = "eu-west-2a"
}

variable "environment" {
  description = "Deployment environment name"
  type        = string
  default     = "dev"
}

variable "ecs_execution_role_arn" {
  description = "IAM role ARN for ECS task execution"
  type        = string
}

variable "ecs_task_role_arn" {
  description = "IAM role ARN for ECS task"
  type        = string
}

variable "bridge_core_image" {
  description = "Container image for bridge core"
  type        = string
  default     = "digex/bridge-core:latest"
}

variable "bridge_db_url" {
  description = "Postgres connection string for bridge core"
  type        = string
}

variable "bridge_redis_url" {
  description = "Redis connection string for bridge core"
  type        = string
}

variable "policy_engine_url" {
  description = "Policy engine URL"
  type        = string
}

variable "token_registry_url" {
  description = "Token registry URL"
  type        = string
}
