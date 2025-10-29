# Hướng Dẫn Build iOS App Tự Động

## Tổng quan

Project này đã được setup với **GitHub Actions** để tự động build iOS app mà không cần máy Mac. Mọi thứ chạy trên cloud macOS runner của GitHub.

## Yêu cầu

- Tài khoản GitHub (miễn phí)
- Repository này được push lên GitHub
- Không cần máy Mac!

## Cách sử dụng

### Bước 1: Push code lên GitHub

Nếu bạn đang dùng GitLab, cần chuyển sang GitHub hoặc mirror repository:

```bash
# Thêm GitHub remote
git remote add github https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push code lên GitHub
git push github main
```

### Bước 2: Trigger Build

1. Vào repository trên GitHub
2. Click tab **Actions**
3. Chọn workflow **"Build iOS App"**
4. Click nút **"Run workflow"** (bên phải)
5. Chọn build mode:
   - **release** - Cho production (khuyến nghị)
   - **debug** - Cho testing
6. Click **"Run workflow"** màu xanh

### Bước 3: Đợi Build hoàn thành

- Thời gian: ~10-15 phút
- Bạn có thể xem tiến trình real-time
- Màu xanh = thành công ✅
- Màu đỏ = thất bại ❌

### Bước 4: Download IPA

Sau khi build xong:

1. Scroll xuống phần **Artifacts**
2. Click download **"Xok102-iOS-Unsigned-release"**
3. Giải nén file zip
4. Bạn sẽ có file `Xok102-unsigned.ipa`

## Thông tin App

- **App Name:** Xok102
- **Bundle ID:** com.xok102.ios
- **Platform:** iOS
- **Cocos Creator:** 2.4.15
- **Orientation:** Portrait

## Re-sign IPA

File IPA được build là **unsigned** (chưa ký). Để phân phối, bạn cần re-sign:

### Cách 1: Dùng fastlane (Mac)

```bash
# Cài đặt fastlane
sudo gem install fastlane

# Re-sign
fastlane run resign \
  ipa:"Xok102-unsigned.ipa" \
  signing_identity:"iPhone Distribution: Your Company" \
  provisioning_profile:"your.mobileprovision"
```

### Cách 2: Dùng zsign (Mac/Linux/Windows)

```bash
# Download zsign từ https://github.com/zhlynn/zsign

# Re-sign
./zsign -k certificate.p12 -p 'password' \
  -m profile.mobileprovision \
  -o Xok102-signed.ipa \
  Xok102-unsigned.ipa
```

## Hot Update

Project đã được cấu hình sẵn cho hot update:

- ✅ MD5 Cache: Đã tắt
- ✅ Bundle ID: Đã set đúng
- ✅ Orientation: Portrait

Để setup hot update server, xem file `HOTUPDATE_GUIDE.md`

## Troubleshooting

### Build thất bại?

1. Check logs trong Actions tab
2. Tìm dòng có ❌ hoặc "error"
3. Thường gặp:
   - Cocos Creator download lỗi → Retry workflow
   - Xcode project không tìm thấy → Check build settings
   - Archive failed → Check code syntax

### Không thấy workflow?

- Đảm bảo file `.github/workflows/build-ios.yml` đã được push
- Check tab Actions có enabled không
- Repository phải là public hoặc có GitHub Pro

### Hết free minutes?

GitHub Free plan:
- 2,000 phút/tháng
- macOS runner: 10x multiplier
- = 200 phút macOS thực tế
- = ~13-20 lần build/tháng

Nếu hết:
- Upgrade lên GitHub Pro ($4/tháng)
- Hoặc đợi tháng sau
- Hoặc dùng self-hosted runner

## Chi phí

### GitHub Free
- ✅ 2,000 phút/tháng
- ✅ Public repositories: Unlimited
- ⚠️ Private repositories: 200 phút macOS/tháng

### GitHub Pro ($4/tháng)
- ✅ 3,000 phút/tháng
- ✅ = 300 phút macOS
- ✅ = ~20-30 builds/tháng

### Sau khi hết quota
- $0.08/phút macOS
- ~$1.2/build (15 phút)

## Tối ưu chi phí

1. **Chỉ build khi cần:**
   - Không auto-build mỗi commit
   - Dùng workflow_dispatch (manual trigger)

2. **Cache dependencies:**
   - Đã được setup trong workflow
   - Giảm thời gian build

3. **Public repository:**
   - Unlimited free minutes!
   - Nếu có thể, set public

## Liên hệ

Nếu gặp vấn đề:
1. Check logs trong Actions
2. Tạo Issue trên GitHub
3. Hoặc liên hệ developer

---

**Tạo bởi:** Manus AI  
**Ngày:** 29/10/2025  
**Version:** 1.0
