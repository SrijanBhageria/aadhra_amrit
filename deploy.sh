#!/bin/bash

# Adhra Amrit - AWS S3 Deployment Script
# This script builds and deploys the Next.js static site to AWS S3

set -e  # Exit on error

# Configuration
BUCKET_NAME="adhra-amrit-7539e3c5"
REGION="ap-south-1"
AWS_PROFILE="${AWS_PROFILE:-default}"  # Use default profile, or set AWS_PROFILE env var

echo "🚀 Starting deployment to AWS S3..."
echo "📦 Bucket: $BUCKET_NAME"
echo "🌍 Region: $REGION"
echo ""

# Step 1: Build the project
echo "📦 Building Next.js project..."
npm run build

if [ ! -d "out" ]; then
  echo "❌ Error: Build output directory 'out' not found!"
  exit 1
fi

echo "✅ Build completed successfully"
echo ""

# Step 2: Check if bucket exists, create if not
echo "🔍 Checking if bucket exists..."
if aws s3 ls "s3://$BUCKET_NAME" --region $REGION 2>&1 | grep -q 'NoSuchBucket'; then
  echo "📦 Creating S3 bucket..."
  aws s3 mb s3://$BUCKET_NAME --region $REGION
  echo "✅ Bucket created"
else
  echo "✅ Bucket already exists"
fi

# Step 3: Configure static website hosting
echo "🌐 Configuring static website hosting..."
aws s3 website s3://$BUCKET_NAME \
  --index-document index.html \
  --error-document index.html \
  --region $REGION
echo "✅ Website hosting configured"

# Step 4: Configure public access
echo "🔓 Configuring public access..."
aws s3api put-public-access-block \
  --bucket $BUCKET_NAME \
  --public-access-block-configuration \
    "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false" \
  --region $REGION
echo "✅ Public access configured"

# Step 5: Set bucket policy for public read
echo "📋 Setting bucket policy..."
cat > /tmp/bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy \
  --bucket $BUCKET_NAME \
  --policy file:///tmp/bucket-policy.json \
  --region $REGION
echo "✅ Bucket policy set"

# Step 6: Sync files to S3
echo "📤 Uploading files to S3..."
aws s3 sync out/ s3://$BUCKET_NAME \
  --delete \
  --region $REGION \
  --exclude "*.map"  # Exclude source maps for smaller size

echo "✅ Files uploaded successfully"
echo ""

# Step 7: Display final URL
WEBSITE_URL="http://$BUCKET_NAME.s3-website.$REGION.amazonaws.com"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Deployment completed successfully!"
echo ""
echo "🌐 Website URL:"
echo "   $WEBSITE_URL"
echo ""
echo "📝 Bucket Name: $BUCKET_NAME"
echo "🌍 Region: $REGION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
