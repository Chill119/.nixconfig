terraform {
  required_version = ">= 1.6.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.70"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

locals {
  name_prefix = "digex-${var.environment}"
}

resource "aws_vpc" "digex" {
  cidr_block           = "10.40.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags = {
    Name = "${local.name_prefix}-vpc"
  }
}

resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.digex.id
  cidr_block              = "10.40.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = var.aws_az
  tags = {
    Name = "${local.name_prefix}-public"
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.digex.id
  tags = {
    Name = "${local.name_prefix}-igw"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.digex.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
  tags = {
    Name = "${local.name_prefix}-public-rt"
  }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

resource "aws_security_group" "bridge" {
  name        = "${local.name_prefix}-bridge-sg"
  description = "Security group for DIGEX bridge services"
  vpc_id      = aws_vpc.digex.id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${local.name_prefix}-bridge-sg"
  }
}

resource "aws_ecs_cluster" "digex" {
  name = "${local.name_prefix}-ecs"
}

resource "aws_cloudwatch_log_group" "bridge" {
  name              = "/digex/${var.environment}/bridge"
  retention_in_days = 30
}

resource "aws_ecs_task_definition" "bridge_core" {
  family                   = "${local.name_prefix}-bridge-core"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 512
  memory                   = 1024
  execution_role_arn       = var.ecs_execution_role_arn
  task_role_arn            = var.ecs_task_role_arn

  container_definitions = jsonencode([
    {
      name  = "bridge-core"
      image = var.bridge_core_image
      portMappings = [
        {
          containerPort = 8080
          hostPort      = 8080
          protocol      = "tcp"
        }
      ]
      environment = [
        { name = "DIGEX_ENV", value = var.environment },
        { name = "BRIDGE_DB_URL", value = var.bridge_db_url },
        { name = "BRIDGE_REDIS_URL", value = var.bridge_redis_url },
        { name = "BRIDGE_POLICY_ENGINE_URL", value = var.policy_engine_url },
        { name = "BRIDGE_TOKEN_REGISTRY_URL", value = var.token_registry_url }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.bridge.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "bridge-core"
        }
      }
    }
  ])
}

resource "aws_ecs_service" "bridge_core" {
  name            = "${local.name_prefix}-bridge-core"
  cluster         = aws_ecs_cluster.digex.id
  task_definition = aws_ecs_task_definition.bridge_core.arn
  launch_type     = "FARGATE"
  desired_count   = 2

  network_configuration {
    subnets         = [aws_subnet.public.id]
    security_groups = [aws_security_group.bridge.id]
    assign_public_ip = true
  }

  lifecycle {
    ignore_changes = [desired_count]
  }
}
