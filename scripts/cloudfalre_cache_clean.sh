#!/bin/bash

# === Cấu hình ===
ZONE_ID="40dc16444f259f712f0cc842d4c8f54c"
API_TOKEN="rsGLnSfqaTIaPP5xavNHtvwlkSla3rWt_4qf_KW5"

# === Xóa toàn bộ cache ===
RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}')

# === Kiểm tra kết quả ===
if echo "$RESPONSE" | grep -q '"success":true'; then
  echo "✅ Đã xóa toàn bộ cache thành công!"
else
  echo "❌ Xóa cache thất bại!"
  echo "Phản hồi từ Cloudflare:"
  echo "$RESPONSE"
fi
