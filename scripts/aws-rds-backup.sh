#!/bin/bash

# ===========================================
# AWS RDS PostgreSQL Backup Script
# ===========================================

set -euo pipefail

# Configuration
DB_IDENTIFIER="${DB_IDENTIFIER:-supplysafe-db}"
AWS_REGION="${AWS_REGION:-us-east-1}"
BACKUP_RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-7}"
S3_BUCKET="${S3_BUCKET:-supplysafe-backups}"
BACKUP_PREFIX="${BACKUP_PREFIX:-rds-backups}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" >&2
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

# Check if AWS CLI is installed
check_dependencies() {
    if ! command -v aws &> /dev/null; then
        error "AWS CLI is not installed. Please install it first."
        exit 1
    fi
    
    if ! command -v jq &> /dev/null; then
        error "jq is not installed. Please install it first."
        exit 1
    fi
    
    log "Dependencies verified successfully"
}

# Verify AWS credentials
verify_aws_credentials() {
    if ! aws sts get-caller-identity &> /dev/null; then
        error "AWS credentials are not configured. Please run 'aws configure'"
        exit 1
    fi
    
    log "AWS credentials verified"
}

# Create manual snapshot
create_snapshot() {
    local snapshot_name="${DB_IDENTIFIER}-manual-$(date +%Y%m%d-%H%M%S)"
    
    log "Creating manual snapshot: $snapshot_name"
    
    aws rds create-db-snapshot \
        --db-instance-identifier "$DB_IDENTIFIER" \
        --db-snapshot-identifier "$snapshot_name" \
        --region "$AWS_REGION"
    
    log "Snapshot creation initiated. Waiting for completion..."
    
    aws rds wait db-snapshot-completed \
        --db-snapshot-identifier "$snapshot_name" \
        --region "$AWS_REGION"
    
    log "Snapshot created successfully: $snapshot_name"
    echo "$snapshot_name"
}

# List snapshots
list_snapshots() {
    log "Listing snapshots for $DB_IDENTIFIER"
    
    aws rds describe-db-snapshots \
        --db-instance-identifier "$DB_IDENTIFIER" \
        --region "$AWS_REGION" \
        --query 'DBSnapshots[?SnapshotType==`manual`].[DBSnapshotIdentifier,SnapshotCreateTime,SnapshotType]' \
        --output table
}

# Delete old snapshots (keep last N days)
cleanup_old_snapshots() {
    log "Cleaning up snapshots older than $BACKUP_RETENTION_DAYS days"
    
    local cutoff_date=$(date -d "$BACKUP_RETENTION_DAYS days ago" +%Y-%m-%d)
    
    local old_snapshots=$(aws rds describe-db-snapshots \
        --db-instance-identifier "$DB_IDENTIFIER" \
        --region "$AWS_REGION" \
        --query "DBSnapshots[?SnapshotType=='manual' && SnapshotCreateTime<'$cutoff_date'].DBSnapshotIdentifier" \
        --output text)
    
    if [[ -z "$old_snapshots" ]]; then
        log "No old snapshots to delete"
        return
    fi
    
    for snapshot in $old_snapshots; do
        log "Deleting snapshot: $snapshot"
        aws rds delete-db-snapshot \
            --db-snapshot-identifier "$snapshot" \
            --region "$AWS_REGION" \
            --final-snapshot-identifier "$snapshot-archived-$(date +%Y%m%d)"
    done
    
    log "Old snapshots cleanup completed"
}

# Export snapshot to S3
export_to_s3() {
    local snapshot_name="$1"
    local export_task_id="${snapshot_name}-export-$(date +%Y%m%d-%H%M%S)"
    
    log "Exporting snapshot $snapshot_name to S3 bucket $S3_BUCKET"
    
    # First, create the export task
    local task_arn=$(aws rds start-export-task \
        --export-task-identifier "$export_task_id" \
        --source-arn "arn:aws:rds:$AWS_REGION:*:snapshot:$snapshot_name" \
        --s3-bucket-name "$S3_BUCKET" \
        --s3-prefix "$BACKUP_PREFIX" \
        --iam-role-arn "arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/RDSExportRole" \
        --kms-key-id "alias/aws/rds" \
        --region "$AWS_REGION" \
        --query 'ExportTaskIdentifier' \
        --output text)
    
    log "Export task started: $task_arn"
    
    # Wait for export to complete
    aws rds wait export-task-completed \
        --export-task-identifier "$export_task_id" \
        --region "$AWS_REGION"
    
    log "Export completed successfully"
}

# Get database status
get_db_status() {
    log "Getting database status for $DB_IDENTIFIER"
    
    aws rds describe-db-instances \
        --db-instance-identifier "$DB_IDENTIFIER" \
        --region "$AWS_REGION" \
        --query 'DBInstances[0].[DBInstanceStatus,Engine,EngineVersion,DBInstanceClass,AllocatedStorage]' \
        --output table
}

# Main function
main() {
    local action="${1:-help}"
    
    case "$action" in
        "snapshot")
            check_dependencies
            verify_aws_credentials
            create_snapshot
            ;;
        "list")
            check_dependencies
            verify_aws_credentials
            list_snapshots
            ;;
        "cleanup")
            check_dependencies
            verify_aws_credentials
            cleanup_old_snapshots
            ;;
        "export")
            check_dependencies
            verify_aws_credentials
            if [[ -z "${2:-}" ]]; then
                error "Please provide snapshot name: $0 export <snapshot-name>"
                exit 1
            fi
            export_to_s3 "$2"
            ;;
        "status")
            check_dependencies
            verify_aws_credentials
            get_db_status
            ;;
        "backup")
            check_dependencies
            verify_aws_credentials
            local snapshot=$(create_snapshot)
            cleanup_old_snapshots
            export_to_s3 "$snapshot"
            ;;
        "help"|*)
            echo "Usage: $0 {snapshot|list|cleanup|export|status|backup|help}"
            echo ""
            echo "Commands:"
            echo "  snapshot    Create a manual database snapshot"
            echo "  list        List all manual snapshots"
            echo "  cleanup     Delete snapshots older than retention period"
            echo "  export      Export snapshot to S3 (requires snapshot name)"
            echo "  status      Get database instance status"
            echo "  backup      Create snapshot, cleanup old ones, and export to S3"
            echo "  help        Show this help message"
            echo ""
            echo "Environment Variables:"
            echo "  DB_IDENTIFIER           Database instance identifier (default: supplysafe-db)"
            echo "  AWS_REGION              AWS region (default: us-east-1)"
            echo "  BACKUP_RETENTION_DAYS   Backup retention period in days (default: 7)"
            echo "  S3_BUCKET               S3 bucket for exports (default: supplysafe-backups)"
            echo "  BACKUP_PREFIX           S3 prefix for backups (default: rds-backups)"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
