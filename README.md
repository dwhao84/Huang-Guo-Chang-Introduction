# Huang Guo Chang Introduction

這是一個可部署到 AWS S3 的靜態網站範例，主要檔案如下：

- `index.html`：首頁
- `error.html`：錯誤頁
- `script.js`：互動功能腳本
- `index_temp.html`：備用頁面

## 直接部署到 S3

### 1. 建立 Bucket

- 到 AWS S3 建立一個 bucket，例如 `task-9-daweihao-static-website`
- 若是作業用途，可先不要開啟版本控制

### 2. 上傳檔案

至少要上傳以下檔案：

- `index.html`
- `error.html`
- `script.js`

如需保留備用頁，也可上傳：

- `index_temp.html`

### 3. 開啟 Static Website Hosting

在 S3 bucket 的 `Properties`：

- 開啟 `Static website hosting`
- `Index document` 填 `index.html`
- `Error document` 填 `error.html`

### 4. 開放讀取權限

在 `Permissions`：

- 關閉 `Block all public access`
- 加上 bucket policy

請把下面的 bucket 名稱改成你自己的：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::task-9-daweihao-static-website/*"
    }
  ]
}
```

### 5. 打開網站

回到 `Properties` 的 `Static website hosting` 區塊，點開 `Bucket website endpoint` 即可。

## 用 AWS CLI 上傳

先確認本機已安裝並設定：

```bash
aws configure
```

手動上傳：

```bash
aws s3 sync . s3://task-9-daweihao-static-website \
  --exclude ".git/*" \
  --exclude ".DS_Store" \
  --exclude "README.md" \
  --exclude "deploy.sh"
```

## 使用部署腳本

專案內已提供 `deploy.sh`：

```bash
chmod +x deploy.sh
./deploy.sh task-9-daweihao-static-website
```

若要指定 AWS profile：

```bash
AWS_PROFILE=default ./deploy.sh task-9-daweihao-static-website
```

## 常見問題

### 網站打開了但按鈕沒作用

通常是忘了上傳 `script.js`。

### 開網站出現 Access Denied

請檢查：

- bucket policy 是否正確
- 是否已關閉 `Block all public access`
- 是否是用 `website endpoint` 開啟，而不是物件預覽網址

### 想用自己的網址

可以再加：

- `CloudFront`
- `Route 53`
- `ACM SSL 憑證`

這樣就能做成正式的 HTTPS 靜態網站。
