#!/bin/bash

################################################################################
# VPS Deployment Script
# Usage: ./scripts/deploy.sh
# Prerequisites:
#   - Docker & Docker Compose installed on VPS
#   - .env file exists on VPS with correct values
#   - GitHub token configured for pulling from GHCR
################################################################################

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ENV_FILE="$PROJECT_ROOT/.env"
COMPOSE_FILE="$PROJECT_ROOT/docker-compose.vps.yml"

################################################################################
# Helper Functions
################################################################################

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

check_prerequisites() {
    log_info "Checking prerequisites..."

    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! command -v docker compose &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi

    if [ ! -f "$ENV_FILE" ]; then
        log_error "Environment file $ENV_FILE not found."
        log_info "Create .env from .env.template and configure it."
        exit 1
    fi

    if [ ! -f "$COMPOSE_FILE" ]; then
        log_error "Docker Compose file $COMPOSE_FILE not found."
        exit 1
    fi

    log_success "All prerequisites met"
}

load_env() {
    log_info "Loading environment variables from $ENV_FILE..."
    set -a
    # shellcheck disable=SC1090
    source "$ENV_FILE"
    set +a
    log_success "Environment variables loaded"
}

login_to_ghcr() {
    log_info "Authenticating with GitHub Container Registry..."

    if [ -z "${GITHUB_TOKEN:-}" ]; then
        log_error "GITHUB_TOKEN not set in .env"
        exit 1
    fi

    if [ -z "${GITHUB_USERNAME:-}" ]; then
        log_error "GITHUB_USERNAME not set in .env"
        exit 1
    fi

    echo "${GITHUB_TOKEN}" | docker login ghcr.io -u "${GITHUB_USERNAME}" --password-stdin
    log_success "Successfully logged in to GHCR"
}

pull_images() {
    local nextjs_image="ghcr.io/${GITHUB_USERNAME}/report-missing:latest"

    log_info "Pulling Next.js image: $nextjs_image"
    docker pull "$nextjs_image"
    log_success "Next.js image pulled"
}

stop_containers() {
    log_info "Stopping existing containers..."

    cd "$PROJECT_ROOT"
    docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" down --remove-orphans 2>/dev/null || true

    log_success "Existing containers stopped"
}

start_containers() {
    log_info "Starting containers..."

    cd "$PROJECT_ROOT"

    if docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d --pull never; then
        log_success "Containers started"

        # Verify containers were actually created
        sleep 2
        local running=$(docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" ps -q | wc -l)
        if [ "$running" -gt 0 ]; then
            log_success "$running containers are running"
        else
            log_error "No containers running after startup!"
            log_error "Docker compose output:"
            docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" ps
            exit 1
        fi
    else
        log_error "Failed to start containers!"
        log_error "Docker compose logs:"
        docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" logs
        exit 1
    fi
}

wait_for_services() {
    log_info "Waiting for services to be healthy..."

    local max_attempts=60
    local attempt=0

    # Wait for MySQL to be healthy
    log_info "Waiting for MySQL to be ready..."
    while [ $attempt -lt $max_attempts ]; do
        if docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" exec -T mysql \
            mysqladmin ping -h localhost -uroot -p"${MYSQL_ROOT_PASSWORD}" &> /dev/null; then
            log_success "MySQL is ready"
            break
        fi
        attempt=$((attempt + 1))
        if [ $((attempt % 10)) -eq 0 ]; then
            log_info "Still waiting for MySQL... ($attempt/${max_attempts})"
        fi
        sleep 1
    done

    if [ $attempt -eq $max_attempts ]; then
        log_warning "MySQL health check still not ready after ${max_attempts}s, proceeding anyway..."
    fi

    # Wait for Next.js to be healthy
    log_info "Waiting for Next.js app to be ready..."
    attempt=0
    while [ $attempt -lt $max_attempts ]; do
        if docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" exec -T nextjs \
            curl -f http://localhost:3000 &> /dev/null; then
            log_success "Next.js app is ready"
            break
        fi
        attempt=$((attempt + 1))
        if [ $((attempt % 10)) -eq 0 ]; then
            log_info "Still waiting for Next.js app... ($attempt/${max_attempts})"
        fi
        sleep 1
    done

    if [ $attempt -eq $max_attempts ]; then
        log_warning "Next.js app health check timeout - it may still be starting"
    fi
}

show_status() {
    log_info "Showing container status..."
    echo ""
    cd "$PROJECT_ROOT"
    docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" ps
    echo ""
}

show_logs() {
    log_info "Recent logs (last 20 lines):"
    echo ""
    cd "$PROJECT_ROOT"
    docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" logs --tail=20
    echo ""
}

cleanup_old_images() {
    log_info "Cleaning up old Docker images and dangling volumes..."

    # Remove dangling images
    docker image prune -f --filter "dangling=true" || true

    # Remove dangling volumes
    docker volume prune -f || true

    log_success "Cleanup completed"
}

show_summary() {
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}    Deployment Completed Successfully!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo "📦 Deployed Images:"
    echo "   • Next.js: ghcr.io/${GITHUB_USERNAME}/report-missing:latest"
    echo ""
    echo "🌐 Application:"
    echo "   • URL: ${NEXT_PUBLIC_API_URL:-http://localhost:3000}"
    echo "   • Port: 3000"
    echo ""
    echo "🗄️  Database:"
    echo "   • Host: mysql"
    echo "   • Port: 3306"
    echo "   • Database: ${MYSQL_DATABASE}"
    echo ""
    echo "📋 Useful Commands:"
    echo "   • View logs: docker compose --env-file \"$ENV_FILE\" -f \"$COMPOSE_FILE\" logs -f nextjs"
    echo "   • Stop services: docker compose --env-file \"$ENV_FILE\" -f \"$COMPOSE_FILE\" down"
    echo "   • Restart service: docker compose --env-file \"$ENV_FILE\" -f \"$COMPOSE_FILE\" restart nextjs"
    echo "   • SSH into container: docker compose --env-file \"$ENV_FILE\" -f \"$COMPOSE_FILE\" exec nextjs sh"
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo ""
}

################################################################################
# Main Deployment Flow
################################################################################

main() {
    log_info "Starting deployment process..."
    echo ""
    
    check_prerequisites
    load_env
    login_to_ghcr
    pull_images
    stop_containers
    start_containers
    wait_for_services
    show_status
    show_logs
    cleanup_old_images
    show_summary
    
    log_success "Deployment complete!"
}

# Run main function
main "$@"
