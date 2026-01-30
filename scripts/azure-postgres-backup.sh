#!/bin/bash

# ===========================================
# Azure PostgreSQL Backup Script
# ===========================================

set -euo pipefail

# Configuration
RESOURCE_GROUP="${RESOURCE_GROUP:-supplysafe-rg}"
SERVER_NAME="${SERVER_NAME:-supplysafe-db-server}"
BACKUP_RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-7}"
STORAGE_ACCOUNT="${STORAGE_ACCOUNT:-supplysafestorage}"
CONTAINER_NAME="${CONTAINER_NAME:-postgres-backups}"

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

# Check if Azure CLI is installed
check_dependencies() {
    if ! command -v az &> /dev/null; then
        error "Azure CLI is not installed. Please install it first."
        exit 1
    fi
    
    if ! command -v jq &> /dev/null; then
        error "jq is not installed. Please install it first."
        exit 1
    fi
    
    log "Dependencies verified successfully"
}

# Verify Azure login
verify_azure_login() {
    if ! az account show &> /dev/null; then
        error "Not logged in to Azure. Please run 'az login'"
        exit 1
    fi
    
    log "Azure login verified"
}

# Create storage account and container if they don't exist
setup_storage() {
    log "Setting up storage account and container"
    
    # Check if resource group exists
    if ! az group show --name "$RESOURCE_GROUP" &> /dev/null; then
        log "Creating resource group: $RESOURCE_GROUP"
        az group create --name "$RESOURCE_GROUP" --location "$(az account show --query location -o tsv)"
    fi
    
    # Check if storage account exists
    if ! az storage account show --name "$STORAGE_ACCOUNT" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
        log "Creating storage account: $STORAGE_ACCOUNT"
        az storage account create \
            --name "$STORAGE_ACCOUNT" \
            --resource-group "$RESOURCE_GROUP" \
            --sku Standard_LRS \
            --kind StorageV2
    fi
    
    # Get storage account key
    local storage_key=$(az storage account keys list \
        --resource-group "$RESOURCE_GROUP" \
        --account-name "$STORAGE_ACCOUNT" \
        --query "[0].value" -o tsv)
    
    # Check if container exists
    if ! az storage container exists \
        --name "$CONTAINER_NAME" \
        --account-name "$STORAGE_ACCOUNT" \
        --account-key "$storage_key" \
        --query "exists" -o tsv | grep -q "true"; then
        
        log "Creating container: $CONTAINER_NAME"
        az storage container create \
            --name "$CONTAINER_NAME" \
            --account-name "$STORAGE_ACCOUNT" \
            --account-key "$storage_key"
    fi
    
    log "Storage setup completed"
}

# Create database backup
create_backup() {
    local backup_name="${SERVER_NAME}-backup-$(date +%Y%m%d-%H%M%S).sql"
    
    log "Creating database backup: $backup_name"
    
    # Get server connection details
    local server_fqdn=$(az postgres server show \
        --resource-group "$RESOURCE_GROUP" \
        --name "$SERVER_NAME" \
        --query "fullyQualifiedDomainName" -o tsv)
    
    local admin_user=$(az postgres server show \
        --resource-group "$RESOURCE_GROUP" \
        --name "$SERVER_NAME" \
        --query "administratorLogin" -o tsv)
    
    # Prompt for password
    echo -n "Enter database password for $admin_user: "
    read -s admin_password
    echo
    
    # Create backup using pg_dump
    PGPASSWORD="$admin_password" pg_dump \
        --host="$server_fqdn" \
        --username="$admin_user" \
        --dbname="postgres" \
        --verbose \
        --clean \
        --no-owner \
        --no-privileges \
        --format=custom \
        --file="/tmp/$backup_name"
    
    if [[ $? -eq 0 ]]; then
        log "Database backup created successfully: /tmp/$backup_name"
        echo "$backup_name"
    else
        error "Failed to create database backup"
        exit 1
    fi
}

# Upload backup to Azure Storage
upload_backup() {
    local backup_file="$1"
    
    log "Uploading backup to Azure Storage"
    
    local storage_key=$(az storage account keys list \
        --resource-group "$RESOURCE_GROUP" \
        --account-name "$STORAGE_ACCOUNT" \
        --query "[0].value" -o tsv)
    
    az storage blob upload \
        --file "/tmp/$backup_file" \
        --name "$backup_file" \
        --container-name "$CONTAINER_NAME" \
        --account-name "$STORAGE_ACCOUNT" \
        --account-key "$storage_key" \
        --overwrite
    
    log "Backup uploaded successfully to: $CONTAINER_NAME/$backup_file"
    
    # Clean up local file
    rm -f "/tmp/$backup_file"
}

# List backups
list_backups() {
    log "Listing backups in storage container"
    
    local storage_key=$(az storage account keys list \
        --resource-group "$RESOURCE_GROUP" \
        --account-name "$STORAGE_ACCOUNT" \
        --query "[0].value" -o tsv)
    
    az storage blob list \
        --container-name "$CONTAINER_NAME" \
        --account-name "$STORAGE_ACCOUNT" \
        --account-key "$storage_key" \
        --query "[].{Name:name,Size:properties.contentLength,LastModified:properties.lastModified}" \
        --output table
}

# Download backup
download_backup() {
    local backup_name="$1"
    local download_path="${2:-./}"
    
    log "Downloading backup: $backup_name"
    
    local storage_key=$(az storage account keys list \
        --resource-group "$RESOURCE_GROUP" \
        --account-name "$STORAGE_ACCOUNT" \
        --query "[0].value" -o tsv)
    
    az storage blob download \
        --name "$backup_name" \
        --container-name "$CONTAINER_NAME" \
        --file "$download_path/$backup_name" \
        --account-name "$STORAGE_ACCOUNT" \
        --account-key "$storage_key"
    
    log "Backup downloaded to: $download_path/$backup_name"
}

# Delete old backups
cleanup_old_backups() {
    log "Cleaning up backups older than $BACKUP_RETENTION_DAYS days"
    
    local cutoff_date=$(date -d "$BACKUP_RETENTION_DAYS days ago" --iso-8601)
    
    local storage_key=$(az storage account keys list \
        --resource-group "$RESOURCE_GROUP" \
        --account-name "$STORAGE_ACCOUNT" \
        --query "[0].value" -o tsv)
    
    local old_backups=$(az storage blob list \
        --container-name "$CONTAINER_NAME" \
        --account-name "$STORAGE_ACCOUNT" \
        --account-key "$storage_key" \
        --query "[?properties.lastModified<'$cutoff_date'].name" \
        --output tsv)
    
    if [[ -z "$old_backups" ]]; then
        log "No old backups to delete"
        return
    fi
    
    for backup in $old_backups; do
        log "Deleting old backup: $backup"
        az storage blob delete \
            --name "$backup" \
            --container-name "$CONTAINER_NAME" \
            --account-name "$STORAGE_ACCOUNT" \
            --account-key "$storage_key"
    done
    
    log "Old backups cleanup completed"
}

# Get server status
get_server_status() {
    log "Getting PostgreSQL server status"
    
    az postgres server show \
        --resource-group "$RESOURCE_GROUP" \
        --name "$SERVER_NAME" \
        --query "{Name:name,Status:userVisibleState,Version:version,StorageMB:storageMB,SKU:sku.name}" \
        --output table
}

# Restore database from backup
restore_backup() {
    local backup_name="$1"
    local new_server_name="${2:-${SERVER_NAME}-restore-$(date +%Y%m%d)}"
    
    log "Restoring database from backup: $backup_name to server: $new_server_name"
    
    # Download backup first
    download_backup "$backup_name" "/tmp"
    
    # Create new server for restore
    local server_sku=$(az postgres server show \
        --resource-group "$RESOURCE_GROUP" \
        --name "$SERVER_NAME" \
        --query "sku.name" -o tsv)
    
    local location=$(az postgres server show \
        --resource-group "$RESOURCE_GROUP" \
        --name "$SERVER_NAME" \
        --query "location" -o tsv)
    
    log "Creating new server for restore: $new_server_name"
    az postgres server create \
        --resource-group "$RESOURCE_GROUP" \
        --name "$new_server_name" \
        --sku "$server_sku" \
        --location "$location" \
        --admin-user "restoreadmin" \
        --admin-password "$(openssl rand -base64 32)" \
        --storage-size 5120
    
    log "Waiting for server to be ready..."
    az postgres server wait \
        --resource-group "$RESOURCE_GROUP" \
        --name "$new_server_name" \
        --custom "state=='Ready'"
    
    # Get connection details for new server
    local new_server_fqdn=$(az postgres server show \
        --resource-group "$RESOURCE_GROUP" \
        --name "$new_server_name" \
        --query "fullyQualifiedDomainName" -o tsv)
    
    log "Restore completed. New server: $new_server_fqdn"
    log "Please use the Azure portal to get the admin password for the restored server."
    
    # Clean up downloaded backup
    rm -f "/tmp/$backup_name"
}

# Main function
main() {
    local action="${1:-help}"
    
    case "$action" in
        "backup")
            check_dependencies
            verify_azure_login
            setup_storage
            local backup_file=$(create_backup)
            upload_backup "$backup_file"
            ;;
        "list")
            check_dependencies
            verify_azure_login
            list_backups
            ;;
        "download")
            check_dependencies
            verify_azure_login
            if [[ -z "${2:-}" ]]; then
                error "Please provide backup name: $0 download <backup-name> [download-path]"
                exit 1
            fi
            download_backup "$2" "${3:-./}"
            ;;
        "cleanup")
            check_dependencies
            verify_azure_login
            cleanup_old_backups
            ;;
        "restore")
            check_dependencies
            verify_azure_login
            if [[ -z "${2:-}" ]]; then
                error "Please provide backup name: $0 restore <backup-name> [new-server-name]"
                exit 1
            fi
            restore_backup "$2" "${3:-}"
            ;;
        "status")
            check_dependencies
            verify_azure_login
            get_server_status
            ;;
        "full-backup")
            check_dependencies
            verify_azure_login
            setup_storage
            local backup_file=$(create_backup)
            upload_backup "$backup_file"
            cleanup_old_backups
            ;;
        "help"|*)
            echo "Usage: $0 {backup|list|download|cleanup|restore|status|full-backup|help}"
            echo ""
            echo "Commands:"
            echo "  backup       Create database backup and upload to storage"
            echo "  list         List all backups in storage"
            echo "  download     Download backup from storage"
            echo "  cleanup      Delete backups older than retention period"
            echo "  restore      Restore database from backup"
            echo "  status       Get PostgreSQL server status"
            echo "  full-backup  Create backup, upload, and cleanup old ones"
            echo "  help         Show this help message"
            echo ""
            echo "Environment Variables:"
            echo "  RESOURCE_GROUP         Azure resource group (default: supplysafe-rg)"
            echo "  SERVER_NAME            PostgreSQL server name (default: supplysafe-db-server)"
            echo "  BACKUP_RETENTION_DAYS  Backup retention period in days (default: 7)"
            echo "  STORAGE_ACCOUNT        Azure storage account (default: supplysafestorage)"
            echo "  CONTAINER_NAME         Storage container name (default: postgres-backups)"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
