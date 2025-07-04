# Scripts Directory

This directory contains utility scripts for the Red Calendar application.

## init-localstack.sh

This script initializes the LocalStack S3 bucket for local development.

### Usage

The script is automatically run by the Docker Compose setup when the `init-localstack` service starts.

### Purpose

- Creates the `cal-red-space` S3 bucket if it doesn't exist
- Sets appropriate ACL permissions for public read access
- Waits for LocalStack to be ready before attempting operations
- Provides feedback on bucket creation status

