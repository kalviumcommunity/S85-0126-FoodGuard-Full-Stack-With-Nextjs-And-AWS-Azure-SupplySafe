#!/bin/bash

# ===========================================
# Cloud Database Migration Script
# ===========================================

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" >&2
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Configuration
MIGRATION_NAME="${MIGRATION_NAME:-}"
DATABASE_URL="${DATABASE_URL:-}"
ENVIRONMENT="${ENVIRONMENT:-development}"
BACKUP_BEFORE_MIGRATION="${BACKUP_BEFORE_MIGRATION:-true}"
DRY_RUN="${DRY_RUN:-false}"

# Check dependencies
check_dependencies() {
    if ! command -v psql &> /dev/null; then
        error "psql is not installed. Please install PostgreSQL client tools."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        error "npm is not installed. Please install Node.js and npm."
        exit 1
    fi
    
    log "Dependencies verified successfully"
}

# Validate environment
validate_environment() {
    if [[ -z "$DATABASE_URL" ]]; then
        error "DATABASE_URL environment variable is not set"
        exit 1
    fi
    
    # Parse database URL to get connection details
    if [[ ! "$DATABASE_URL" =~ ^postgresql:// ]]; then
        error "DATABASE_URL must be a valid PostgreSQL connection string"
        exit 1
    fi
    
    log "Environment validation passed"
}

# Test database connection
test_connection() {
    info "Testing database connection..."
    
    if ! PGPASSWORD="" psql "$DATABASE_URL" -c "SELECT 1;" &> /dev/null; then
        error "Cannot connect to database. Please check DATABASE_URL and network connectivity."
        exit 1
    fi
    
    log "Database connection successful"
}

# Create backup before migration
create_backup() {
    if [[ "$BACKUP_BEFORE_MIGRATION" != "true" ]]; then
        info "Skipping backup (BACKUP_BEFORE_MIGRATION=false)"
        return
    fi
    
    local backup_name="pre-migration-$(date +%Y%m%d-%H%M%S).sql"
    info "Creating backup: $backup_name"
    
    # Extract database name from URL
    local db_name=$(echo "$DATABASE_URL" | sed -n 's/.*\/\([^?]*\).*/\1/p')
    
    # Create backup
    if ! pg_dump "$DATABASE_URL" > "backups/$backup_name" 2>/dev/null; then
        error "Failed to create backup"
        exit 1
    fi
    
    log "Backup created successfully: backups/$backup_name"
}

# Ensure backups directory exists
ensure_backup_dir() {
    mkdir -p backups
}

# Check if database is empty
check_database_status() {
    info "Checking database status..."
    
    local table_count=$(psql "$DATABASE_URL" -t -c "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | tr -d ' ')
    
    if [[ "$table_count" -eq 0 ]]; then
        info "Database is empty - fresh installation detected"
        return 0
    else
        info "Database contains $table_count tables - existing installation detected"
        return 1
    fi
}

# Run Prisma migrations
run_prisma_migrations() {
    info "Running Prisma migrations..."
    
    if [[ "$DRY_RUN" == "true" ]]; then
        warn "DRY RUN: Would run 'npx prisma migrate deploy'"
        return
    fi
    
    # Generate Prisma client
    if ! npm run db:generate; then
        error "Failed to generate Prisma client"
        exit 1
    fi
    
    # Deploy migrations (non-interactive)
    if ! npx prisma migrate deploy --skip-generate; then
        error "Failed to deploy Prisma migrations"
        exit 1
    fi
    
    log "Prisma migrations deployed successfully"
}

# Create initial migration if needed
create_initial_migration() {
    if [[ -n "$MIGRATION_NAME" ]]; then
        info "Creating new migration: $MIGRATION_NAME"
        
        if [[ "$DRY_RUN" == "true" ]]; then
            warn "DRY RUN: Would run 'npx prisma migrate dev --name $MIGRATION_NAME'"
            return
        fi
        
        if ! npx prisma migrate dev --name "$MIGRATION_NAME" --skip-seed; then
            error "Failed to create migration"
            exit 1
        fi
        
        log "Migration created successfully"
    fi
}

# Seed database with initial data
seed_database() {
    if [[ "$ENVIRONMENT" == "production" ]]; then
        warn "Skipping database seeding in production environment"
        return
    fi
    
    info "Seeding database with initial data..."
    
    if [[ "$DRY_RUN" == "true" ]]; then
        warn "DRY RUN: Would run 'npm run db:seed'"
        return
    fi
    
    if ! npm run db:seed; then
        warn "Database seeding failed (this might be expected)"
    else
        log "Database seeded successfully"
    fi
}

# Verify migration success
verify_migration() {
    info "Verifying migration success..."
    
    # Check if Prisma tables exist
    local prisma_tables=$(psql "$DATABASE_URL" -t -c "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '_prisma_%';" 2>/dev/null | tr -d ' ')
    
    if [[ "$prisma_tables" -gt 0 ]]; then
        log "Prisma migration tables found"
    else
        warn "No Prisma migration tables found"
    fi
    
    # Check application tables
    local app_tables=$(psql "$DATABASE_URL" -t -c "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name NOT LIKE '_prisma_%';" 2>/dev/null | tr -d ' ')
    
    log "Found $app_tables application tables"
    
    # Test basic query
    if psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM users;" &> /dev/null; then
        log "Basic database query test passed"
    else
        warn "Basic database query test failed (table might not exist yet)"
    fi
}

# Generate migration report
generate_report() {
    info "Generating migration report..."
    
    local report_file="migration-report-$(date +%Y%m%d-%H%M%S).txt"
    
    cat > "$report_file" << EOF
========================================
Database Migration Report
========================================
Timestamp: $(date)
Environment: $ENVIRONMENT
Database URL: ${DATABASE_URL//postgresql:\/\/*@/postgresql://***@}
Dry Run: $DRY_RUN

Migration Details:
- Migration Name: ${MIGRATION_NAME:-"N/A"}
- Backup Created: ${BACKUP_BEFORE_MIGRATION}
- Database Seeded: $([[ "$ENVIRONMENT" != "production" ]] && echo "Yes" || echo "No")

Database Status:
EOF

    # Add database information
    psql "$DATABASE_URL" -c "
SELECT 
    'Database Version: ' || version() as info
UNION ALL
SELECT 
    'Current Database: ' || current_database() as info
UNION ALL
SELECT 
    'Current User: ' || current_user as info
UNION ALL
SELECT 
    'Table Count: ' || count(*)::text as info
FROM information_schema.tables 
WHERE table_schema = 'public';
" >> "$report_file" 2>/dev/null || true

    echo "" >> "$report_file"
    echo "Migration completed successfully!" >> "$report_file"
    
    log "Migration report generated: $report_file"
}

# Cleanup function
cleanup() {
    info "Cleaning up temporary files..."
    # Add any cleanup logic here
}

# Main migration function
run_migration() {
    log "Starting database migration..."
    
    check_dependencies
    validate_environment
    test_connection
    ensure_backup_dir
    
    # Check if database is empty
    if check_database_status; then
        info "Fresh database detected - running initial setup"
        run_prisma_migrations
        seed_database
    else
        info "Existing database detected - running migration"
        create_backup
        create_initial_migration
        run_prisma_migrations
    fi
    
    verify_migration
    generate_report
    
    log "Migration completed successfully!"
}

# Rollback function
rollback_migration() {
    warn "Rolling back last migration..."
    
    if [[ "$DRY_RUN" == "true" ]]; then
        warn "DRY RUN: Would run 'npx prisma migrate reset'"
        return
    fi
    
    # Create backup before rollback
    create_backup
    
    # Reset database (this will drop all data)
    if npx prisma migrate reset --force --skip-seed; then
        log "Migration rollback completed"
        log "Database has been reset to initial state"
    else
        error "Migration rollback failed"
        exit 1
    fi
}

# Status function
show_status() {
    info "Database Migration Status"
    echo "========================"
    
    validate_environment
    test_connection
    
    # Show migration history
    info "Migration History:"
    npx prisma migrate status || warn "Could not get migration status"
    
    # Show table information
    info "Database Tables:"
    psql "$DATABASE_URL" -c "
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
" 2>/dev/null || warn "Could not list tables"
    
    # Show row counts
    info "Table Row Counts:"
    psql "$DATABASE_URL" -c "
SELECT 
    schemaname,
    tablename,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes,
    n_live_tup as live_rows,
    n_dead_tup as dead_rows
FROM pg_stat_user_tables
ORDER BY schemaname, tablename;
" 2>/dev/null || warn "Could not get table statistics"
}

# Help function
show_help() {
    echo "Cloud Database Migration Script"
    echo "================================"
    echo ""
    echo "Usage: $0 {migrate|rollback|status|help}"
    echo ""
    echo "Commands:"
    echo "  migrate    Run database migration (default)"
    echo "  rollback   Rollback last migration"
    echo "  status     Show migration status"
    echo "  help       Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  DATABASE_URL              PostgreSQL connection string (required)"
    echo "  ENVIRONMENT               Environment (development|staging|production)"
    echo "  MIGRATION_NAME            Name for new migration"
    echo "  BACKUP_BEFORE_MIGRATION   Create backup before migration (true|false)"
    echo "  DRY_RUN                   Perform dry run without making changes (true|false)"
    echo ""
    echo "Examples:"
    echo "  DATABASE_URL=\"postgresql://user:pass@host:5432/db\" $0 migrate"
    echo "  ENVIRONMENT=production MIGRATION_NAME=add_new_feature $0 migrate"
    echo "  DRY_RUN=true $0 migrate"
}

# Main execution
main() {
    local action="${1:-migrate}"
    
    # Set up cleanup trap
    trap cleanup EXIT
    
    case "$action" in
        "migrate")
            run_migration
            ;;
        "rollback")
            rollback_migration
            ;;
        "status")
            show_status
            ;;
        "help"|*)
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
