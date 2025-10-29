#!/bin/bash

# dùng lệnh này để add ssh key vào server, nhớ thay path tới key trong máy local và sửa ip server, sau đó nhập mật khẩu đăng nhập server, 
# cat ~/.ssh/id_rsa.pub | ssh root@103.116.38.55 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && chmod 700 ~/.ssh"



# --- CONFIG --- 
BUILD_PATH="build"
PLATFORM="web-mobile"
LOCAL_PATH="$BUILD_PATH/$PLATFORM"
FILE_NAME="$PLATFORM.tar.gz"
FILE_PATH="$LOCAL_PATH/$FILE_NAME"

# --- SFTP --- 
HOST="103.116.38.55"
USER="root"
REMOTE_DIR="/www/wwwroot/i.xok102.com"

# --- STEP 1: Compress ---
echo "🗜️ Compressing assets and src..."

# Chuyển đến thư mục đúng trước khi nén
cd "$LOCAL_PATH" || { echo "❌ Failed to change directory to $LOCAL_PATH"; exit 1; }

# Nén toàn bộ thư mục `assets` và `src` vào file tar
tar -czf "$FILE_NAME" assets src || { echo "❌ Compression failed"; exit 1; }

echo "✅ Compressed $FILE_NAME"

# --- STEP 2: Upload via SCP --- 
echo "🚀 Uploading via SCP..."

# Sử dụng SCP để tải file lên server
scp "$FILE_NAME" "$USER@$HOST:$REMOTE_DIR" || { echo "❌ Upload failed"; exit 1; }

echo "✅ Uploaded $FILE_NAME"

# --- STEP 3: SSH to extract --- 
echo "🔓 Extracting on server..."
ssh "$USER@$HOST" <<EOF
clear
cd "$REMOTE_DIR" || { echo "❌ Failed to change directory to $REMOTE_DIR"; exit 1; }
rm -rf assets src || { echo "❌ Failed to remove old assets and src"; exit 1; }
tar -xzf "$FILE_NAME" || { echo "❌ Extraction failed"; exit 1; }
rm "$FILE_NAME" || { echo "❌ Failed to remove the tar file"; exit 1; }
exit
EOF

# --- STEP 4: Done --- 
echo "✅ Deploy complete!"
