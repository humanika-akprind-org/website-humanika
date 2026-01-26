#!/bin/bash

# Humanika Log Collector Service
# This script collects and monitors logs from all containers

LOG_DIR="/var/log/humanika"
CONTAINERS=("humanika-app" "humanika-db")

# Create log directories
mkdir -p "$LOG_DIR/app"
mkdir -p "$LOG_DIR/mysql"
mkdir -p "$LOG_DIR/nginx"

echo "=== Humanika Log Collector Started at $(date) ==="

# Function to collect container logs
collect_logs() {
    local container=$1
    local log_file="$LOG_DIR/${container}.log"
    
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Collecting logs from $container..." >> "$log_file"
    docker logs --since 1h "$container" 2>&1 >> "$log_file" &
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Logs collected from $container" >> "$LOG_DIR/collector.log"
}

# Function to rotate logs
rotate_logs() {
    local max_files=10
    local max_size_mb=10
    
    for container in "${CONTAINERS[@]}"; do
        # Check file size
        local log_file="$LOG_DIR/${container}.log"
        if [ -f "$log_file" ]; then
            local size_mb=$(du -m "$log_file" | cut -f1)
            if [ "$size_mb" -ge "$max_size_mb" ]; then
                # Rotate log file
                mv "$log_file" "${log_file}.old"
                touch "$log_file"
                echo "[$(date '+%Y-%m-%d %H:%M:%S')] Rotated $log_file due to size limit" >> "$LOG_DIR/collector.log"
            fi
        fi
    done
}

# Main loop
while true; do
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Log collector running..." >> "$LOG_DIR/collector.log"
    
    # Collect logs from each container
    for container in "${CONTAINERS[@]}"; do
        if docker ps --format '{{.Names}}' | grep -q "^${container}$"; then
            collect_logs "$container"
        fi
    done
    
    # Rotate logs if needed
    rotate_logs
    
    # Wait 5 minutes before next collection
    sleep 300
done

