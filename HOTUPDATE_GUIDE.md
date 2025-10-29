# Hướng Dẫn Setup Hot Update cho Xok102

## Tổng quan

Hot Update cho phép bạn cập nhật game mà không cần người dùng phải cài đặt lại app. Điều này cực kỳ hữu ích cho việc sửa lỗi nhanh và thêm nội dung mới.

## Nguyên lý hoạt động

1. **Lần đầu:** User cài đặt IPA (version 1.0.0)
2. **Khi mở app:** App kiểm tra server có version mới không
3. **Nếu có:** Tải về các file đã thay đổi (scripts, assets)
4. **Áp dụng:** Restart game với version mới
5. **Lần sau:** Không cần build IPA nữa, chỉ upload files lên server

## Cấu hình hiện tại

Project đã được cấu hình sẵn:

- ✅ **MD5 Cache:** Đã tắt (quan trọng!)
- ✅ **Bundle ID:** com.xok102.ios
- ✅ **Optimize Hot Update:** Có thể bật nếu cần

## Bước 1: Tích hợp Hot Update Component

### 1.1. Tạo HotUpdate Script

Tạo file `assets/scripts/HotUpdate.ts`:

```typescript
const { ccclass, property } = cc._decorator;

@ccclass
export default class HotUpdate extends cc.Component {
    
    @property(cc.Label)
    statusLabel: cc.Label = null;
    
    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;
    
    private _am: jsb.AssetsManager = null;
    private _updating = false;
    private _canRetry = false;
    
    // URL manifest trên server
    private manifestUrl = "https://your-server.com/remote-assets/project.manifest";
    
    onLoad() {
        if (!cc.sys.isNative) {
            return;
        }
        
        // Khởi tạo AssetsManager
        let storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'remote-assets');
        this._am = new jsb.AssetsManager('', storagePath, this.versionCompareHandle);
        
        // Setup callbacks
        this._am.setEventCallback(this.checkCallback.bind(this));
        this._am.setVerifyCallback(this.verifyCallback.bind(this));
        
        // Load local manifest
        if (cc.loader.getRes('project.manifest')) {
            this._am.loadLocalManifest('project.manifest');
        }
        
        // Bắt đầu check update
        this.checkUpdate();
    }
    
    checkUpdate() {
        if (this._updating) {
            return;
        }
        
        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            let url = this.manifestUrl;
            this._am.loadLocalManifest(url);
        }
        
        if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
            this.updateStatus('Failed to load local manifest');
            return;
        }
        
        this._am.setEventCallback(this.checkCallback.bind(this));
        this._am.checkUpdate();
        this._updating = true;
    }
    
    hotUpdate() {
        if (this._am && !this._updating) {
            this._am.setEventCallback(this.updateCallback.bind(this));
            this._am.update();
            this._updating = true;
        }
    }
    
    checkCallback(event: jsb.EventAssetsManager) {
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.updateStatus("No local manifest file found");
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                this.updateStatus("Failed to download manifest file");
                break;
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.updateStatus("Failed to parse manifest file");
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.updateStatus("Already up to date");
                this._updating = false;
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                this.updateStatus('New version found, start updating');
                this.hotUpdate();
                break;
            default:
                return;
        }
    }
    
    updateCallback(event: jsb.EventAssetsManager) {
        let needRestart = false;
        let failed = false;
        
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.updateStatus('No local manifest file found');
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                let percent = event.getPercent();
                if (this.progressBar) {
                    this.progressBar.progress = percent;
                }
                this.updateStatus('Downloading: ' + (percent * 100).toFixed(2) + '%');
                break;
            case jsb.EventAssetsManager.ASSET_UPDATED:
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.updateStatus('Failed to download manifest file');
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.updateStatus('Already up to date');
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                this.updateStatus('Update finished. Restarting...');
                needRestart = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                this.updateStatus('Update failed. ' + event.getMessage());
                this._updating = false;
                this._canRetry = true;
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                this.updateStatus('Asset update error: ' + event.getAssetId() + ', ' + event.getMessage());
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                this.updateStatus(event.getMessage());
                break;
            default:
                break;
        }
        
        if (failed) {
            this._am.setEventCallback(null);
            this._updating = false;
        }
        
        if (needRestart) {
            this._am.setEventCallback(null);
            // Restart game
            cc.audioEngine.stopAll();
            cc.game.restart();
        }
    }
    
    verifyCallback(path: string, asset: any) {
        let compressed = asset.compressed;
        let expectedMD5 = asset.md5;
        let relativePath = asset.path;
        
        let realMD5 = jsb.fileUtils.getFileMD5(path);
        if (realMD5 === expectedMD5) {
            return true;
        } else {
            return false;
        }
    }
    
    versionCompareHandle(versionA: string, versionB: string) {
        let vA = versionA.split('.');
        let vB = versionB.split('.');
        for (let i = 0; i < vA.length; ++i) {
            let a = parseInt(vA[i]);
            let b = parseInt(vB[i] || '0');
            if (a === b) {
                continue;
            } else {
                return a - b;
            }
        }
        if (vB.length > vA.length) {
            return -1;
        } else {
            return 0;
        }
    }
    
    updateStatus(status: string) {
        if (this.statusLabel) {
            this.statusLabel.string = status;
        }
        console.log('[HotUpdate]', status);
    }
}
```

### 1.2. Thêm vào Scene

1. Tạo node mới trong scene Loading/Splash
2. Add component HotUpdate
3. Tạo Label cho status
4. Tạo ProgressBar cho tiến trình
5. Link vào component

## Bước 2: Tạo Manifest Files

### 2.1. Download version_generator.js

```bash
curl -O https://raw.githubusercontent.com/cocos-creator/tutorial-hot-update/master/version_generator.js
```

### 2.2. Chạy sau mỗi lần build

```bash
# Sau khi build iOS project
node version_generator.js \
  -v 1.0.1 \
  -u https://your-cdn.com/remote-assets/ \
  -s build/jsb-link/ \
  -d remote-assets/
```

Tham số:
- `-v`: Version mới (1.0.1, 1.0.2, ...)
- `-u`: URL gốc trên server
- `-s`: Thư mục build source
- `-d`: Thư mục output manifest

### 2.3. Kết quả

Sẽ tạo ra:
- `remote-assets/project.manifest` - Full manifest
- `remote-assets/version.manifest` - Version check only

## Bước 3: Setup Server

### Option 1: Nginx (Khuyến nghị)

```nginx
server {
    listen 80;
    server_name your-server.com;
    
    location /remote-assets/ {
        root /var/www/html;
        
        # CORS headers
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, OPTIONS";
        add_header Access-Control-Allow-Headers "Content-Type";
        
        # Cache control
        add_header Cache-Control "no-cache, must-revalidate";
        
        # Gzip
        gzip on;
        gzip_types application/json text/plain;
    }
}
```

### Option 2: CDN (Cloudflare, AWS S3)

Upload folder `remote-assets/` lên CDN và lấy URL public.

### Option 3: GitHub Pages (Miễn phí!)

```bash
# Tạo branch gh-pages
git checkout -b gh-pages
git rm -rf .
cp -r remote-assets/* .
git add .
git commit -m "Add hot update assets"
git push origin gh-pages

# URL sẽ là: https://username.github.io/repo-name/
```

## Bước 4: Cấu trúc Server

```
remote-assets/
├── version.manifest          # Version check file
├── project.manifest          # Full manifest
├── src/                      # JavaScript files
│   ├── project.dev.js
│   └── ...
└── res/                      # Resources
    ├── raw-assets/
    └── ...
```

## Workflow Update

### Lần đầu tiên (Version 1.0.0)

1. Build iOS project từ Cocos Creator
2. Build IPA và phân phối
3. Generate manifest version 1.0.0
4. Upload lên server

### Lần update (Version 1.0.1)

1. Sửa code/assets trong Cocos Creator
2. Build iOS project lại
3. Generate manifest version 1.0.1
4. Upload CHỈ các file manifest + src + res lên server
5. **KHÔNG cần build IPA mới!**
6. User mở app → Tự động update

## Script tự động

Tạo file `update.sh`:

```bash
#!/bin/bash

VERSION=$1

if [ -z "$VERSION" ]; then
    echo "Usage: ./update.sh <version>"
    exit 1
fi

echo "🔨 Building iOS project..."
# Build từ Cocos Creator command line nếu cần

echo "📦 Generating manifests..."
node version_generator.js \
  -v "$VERSION" \
  -u https://your-server.com/remote-assets/ \
  -s build/jsb-link/ \
  -d remote-assets/

echo "⬆️  Uploading to server..."
rsync -avz remote-assets/ user@server:/var/www/html/remote-assets/

echo "✅ Done! Version $VERSION deployed"
```

Sử dụng:
```bash
./update.sh 1.0.2
```

## Testing

### Test trên simulator:

1. Build và cài app version 1.0.0
2. Thay đổi code
3. Generate manifest 1.0.1
4. Upload lên server
5. Mở app → Sẽ thấy update progress

### Debug:

```typescript
// Bật debug log
if (this._am) {
    this._am.setMaxConcurrentTask(2);
    this._am.setConnectionTimeout(3);
}
```

## Lưu ý quan trọng

⚠️ **Những gì CÓ THỂ hot update:**
- ✅ JavaScript/TypeScript code
- ✅ Assets (images, audio, prefabs)
- ✅ Scenes
- ✅ JSON data

⚠️ **Những gì KHÔNG THỂ hot update:**
- ❌ Native code (Objective-C, Java)
- ❌ Engine version
- ❌ Build settings
- ❌ Permissions

## Troubleshooting

### Update không hoạt động?

1. Check URL manifest đúng chưa
2. Check CORS headers trên server
3. Check MD5 Cache đã tắt chưa
4. Check version format (x.y.z)

### Download chậm?

1. Dùng CDN
2. Bật gzip trên server
3. Optimize assets size

### App crash sau update?

1. Check engine version compatibility
2. Test kỹ trước khi deploy
3. Có backup version cũ

## Tóm tắt

✅ Tích hợp HotUpdate component  
✅ Generate manifest sau mỗi build  
✅ Upload lên server  
✅ User tự động nhận update  
✅ Không cần build IPA mới!  

---

**Tạo bởi:** Manus AI  
**Ngày:** 29/10/2025
