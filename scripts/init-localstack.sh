#!/bin/sh
set -e

BUCKET=cal-red-space
ENDPOINT=http://localstack:4566

# Wait for LocalStack to be ready
until aws --endpoint-url=$ENDPOINT s3api list-buckets > /dev/null 2>&1; do
  echo "Waiting for LocalStack S3..."
  sleep 2
done

echo "Checking if bucket $BUCKET exists..."
if aws --endpoint-url=$ENDPOINT s3api head-bucket --bucket $BUCKET 2>/dev/null; then
  echo "Bucket $BUCKET already exists."
else
  echo "Creating bucket $BUCKET..."
  aws --endpoint-url=$ENDPOINT s3api create-bucket --bucket $BUCKET --region us-east-1
  aws --endpoint-url=$ENDPOINT s3api put-bucket-acl --bucket $BUCKET --acl public-read
  echo "Bucket $BUCKET created and ACL set."
fi

aws --endpoint-url=$ENDPOINT s3api list-buckets --query 'Buckets[].Name' --output table 