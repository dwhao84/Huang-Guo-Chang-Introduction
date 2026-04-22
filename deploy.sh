#!/usr/bin/env bash

set -euo pipefail

if ! command -v aws >/dev/null 2>&1; then
  echo "找不到 aws 指令，請先安裝 AWS CLI。"
  exit 1
fi

if [ "$#" -lt 1 ]; then
  echo "用法: ./deploy.sh <bucket-name>"
  echo "範例: ./deploy.sh task-9-daweihao-static-website"
  exit 1
fi

BUCKET_NAME="$1"

echo "開始上傳到 s3://${BUCKET_NAME}"

aws s3 sync . "s3://${BUCKET_NAME}" \
  --exclude ".git/*" \
  --exclude ".DS_Store" \
  --exclude "README.md" \
  --exclude "deploy.sh"

echo "上傳完成。"
echo "請到 AWS S3 > Properties > Static website hosting 查看網站網址。"
