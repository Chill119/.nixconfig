# DIGEX Digibank – London Blockchain Bridge & JPM Hybrid Infrastructure

This directory contains the PRD plus infrastructure artifacts for the London Blockchain Bridge program.

## Contents
- `PRD.md`: Product Requirements Document.
- `infra/docker-compose.yaml`: Local orchestration for bridge services.
- `infra/terraform/`: Terraform IaC for AWS-based deployments.
- `ui/`: Lightweight UI preview for the PRD.

## Local Deployment (Docker Compose)
1. Ensure Docker and Docker Compose are installed.
2. From this directory, start the local stack:
   ```bash
   docker compose -f infra/docker-compose.yaml up -d
   ```
3. Validate services:
   - Bridge Core: `http://localhost:8080/health`
   - API Gateway: `http://localhost:8000/health`
   - Grafana: `http://localhost:3000` (admin password: `digex`)

### Local Notes
- Replace the `digex/*:latest` images with your build pipeline outputs.
- Configure secrets via environment variables or a secrets manager before production use.

## Cloud Deployment (AWS + Terraform)
1. Install Terraform `>= 1.6` and configure AWS credentials.
2. Change into the Terraform directory:
   ```bash
   cd infra/terraform
   ```
3. Create a `terraform.tfvars` file with your required values:
   ```hcl
   ecs_execution_role_arn = "arn:aws:iam::<account-id>:role/digex-ecs-execution"
   ecs_task_role_arn      = "arn:aws:iam::<account-id>:role/digex-ecs-task"
   bridge_db_url          = "postgres://user:pass@db.internal:5432/digex"
   bridge_redis_url       = "redis://cache.internal:6379"
   policy_engine_url      = "http://policy.internal:8090"
   token_registry_url     = "http://registry.internal:8070"
   ```
4. Initialize and apply:
   ```bash
   terraform init
   terraform apply
   ```

### Cloud Notes
- The Terraform stack creates a VPC, public subnet, ECS cluster, and a Fargate service for Bridge Core.
- Integrate additional services (API Gateway, token registry, policy engine, observability) using the same ECS cluster.
- For production, add private subnets, NAT gateways, WAF, and secrets storage.

## System Workflow References
The PRD references the uploaded DIGEX Digibank cover and workflow images for:
- Architecture overview
- Protocol design & smart contracts
- Operations and monitoring flows

Use those assets when assembling the final presentation deck.

## UI Preview (Compile & Display)
1. Build the static UI bundle:
   ```bash
   ./ui/build.sh
   ```
2. Serve the compiled output from `ui/dist`:
   ```bash
   cd ui/dist
   python -m http.server 5173
   ```
3. Open `http://localhost:5173` in a browser to view the PRD UI.
