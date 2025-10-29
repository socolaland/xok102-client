#!/bin/bash

echo "🚀 Setup GitHub Repository for iOS Auto-Build"
echo "=============================================="
echo ""

# Kiểm tra git
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed!"
    exit 1
fi

echo "📝 Bạn cần:"
echo "1. Tạo repository mới trên GitHub (https://github.com/new)"
echo "2. Đặt tên repository (ví dụ: xok102-client)"
echo "3. Chọn Public hoặc Private"
echo "4. KHÔNG tạo README, .gitignore, license"
echo ""

read -p "Bạn đã tạo repository trên GitHub chưa? (y/n): " created

if [ "$created" != "y" ]; then
    echo "❌ Vui lòng tạo repository trước rồi chạy lại script này"
    exit 1
fi

echo ""
read -p "Nhập GitHub username của bạn: " username
read -p "Nhập tên repository (ví dụ: xok102-client): " reponame

GITHUB_URL="https://github.com/$username/$reponame.git"

echo ""
echo "📍 Repository URL: $GITHUB_URL"
echo ""

# Kiểm tra xem đã có remote github chưa
if git remote | grep -q "^github$"; then
    echo "⚠️  Remote 'github' đã tồn tại, removing..."
    git remote remove github
fi

# Thêm GitHub remote
echo "🔗 Adding GitHub remote..."
git remote add github "$GITHUB_URL"

# Kiểm tra branch hiện tại
CURRENT_BRANCH=$(git branch --show-current)
echo "📌 Current branch: $CURRENT_BRANCH"

# Add và commit workflow files
echo "📦 Committing workflow files..."
git add .github/workflows/build-ios.yml
git add BUILD_GUIDE.md
git add setup-github.sh
git commit -m "Add GitHub Actions workflow for iOS build" || echo "No changes to commit"

# Push lên GitHub
echo "⬆️  Pushing to GitHub..."
echo ""
read -p "Bạn đã setup GitHub authentication chưa? (y/n): " auth_setup

if [ "$auth_setup" != "y" ]; then
    echo ""
    echo "⚠️  Bạn cần setup authentication trước:"
    echo ""
    echo "Option 1: Personal Access Token (Khuyến nghị)"
    echo "  1. Vào https://github.com/settings/tokens"
    echo "  2. Click 'Generate new token (classic)'"
    echo "  3. Check 'repo' scope"
    echo "  4. Copy token"
    echo "  5. Khi push, dùng token làm password"
    echo ""
    echo "Option 2: SSH Key"
    echo "  1. ssh-keygen -t ed25519 -C 'your_email@example.com'"
    echo "  2. cat ~/.ssh/id_ed25519.pub"
    echo "  3. Add vào https://github.com/settings/keys"
    echo "  4. Đổi remote: git remote set-url github git@github.com:$username/$reponame.git"
    echo ""
    read -p "Nhấn Enter khi đã setup xong..."
fi

echo ""
echo "🚀 Pushing to GitHub..."
git push github "$CURRENT_BRANCH"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ =========================================="
    echo "✅  SETUP THÀNH CÔNG!"
    echo "✅ =========================================="
    echo ""
    echo "🎉 Repository đã được push lên GitHub!"
    echo ""
    echo "📋 Các bước tiếp theo:"
    echo ""
    echo "1. Mở repository trên GitHub:"
    echo "   https://github.com/$username/$reponame"
    echo ""
    echo "2. Click tab 'Actions'"
    echo ""
    echo "3. Click workflow 'Build iOS App'"
    echo ""
    echo "4. Click nút 'Run workflow' (bên phải)"
    echo ""
    echo "5. Chọn build mode: release"
    echo ""
    echo "6. Click 'Run workflow' màu xanh"
    echo ""
    echo "7. Đợi ~10-15 phút"
    echo ""
    echo "8. Download IPA từ Artifacts"
    echo ""
    echo "📖 Chi tiết: Đọc file BUILD_GUIDE.md"
    echo ""
else
    echo ""
    echo "❌ Push thất bại!"
    echo ""
    echo "Có thể do:"
    echo "- Chưa setup authentication"
    echo "- Repository URL sai"
    echo "- Không có quyền push"
    echo ""
    echo "Thử lại:"
    echo "git push github $CURRENT_BRANCH"
fi
