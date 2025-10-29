const fs = require('fs');
const path = require('path');

// Các đuôi file asset cần kiểm tra
const assetExts = ['.png', '.jpg', '.jpeg', '.mp3', '.json', '.fnt', '.plist'];
const searchExts = ['.ts', '.js', '.json', '.fire', '.prefab', '.anim', '.meta'];

const assetDir = path.resolve(__dirname, '../assets');
const projectDir = path.resolve(__dirname, '../');

function walk(dir, filterExts) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filepath = path.join(dir, file);
        const stat = fs.statSync(filepath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(filepath, filterExts));
        } else {
            const ext = path.extname(filepath).toLowerCase();
            if (filterExts.includes(ext)) {
                results.push(filepath);
            }
        }
    });
    return results;
}

function getUUIDFromMeta(metaPath) {
    try {
        const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
        return meta.uuid || null;
    } catch {
        return null;
    }
}

function getAllUsedUUIDs(searchPaths) {
    let used = new Set();
    for (const file of searchPaths) {
        const content = fs.readFileSync(file, 'utf8');
        const matches = content.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi);
        if (matches) {
            matches.forEach(uuid => used.add(uuid));
        }
    }
    return used;
}

function main() {
    const assetFiles = walk(assetDir, assetExts);
    const allSearchFiles = walk(projectDir, searchExts);
    const usedUUIDs = getAllUsedUUIDs(allSearchFiles);

    let unusedAssets = [];

    for (const assetPath of assetFiles) {
        const metaPath = assetPath + '.meta';
        if (fs.existsSync(metaPath)) {
            const uuid = getUUIDFromMeta(metaPath);
            if (uuid && !usedUUIDs.has(uuid)) {
                unusedAssets.push({ assetPath, uuid });
            }
        }
    }

    if (unusedAssets.length > 0) {
        console.log(`🗑 Có ${unusedAssets.length} file KHÔNG được sử dụng:\n`);
        unusedAssets.forEach(file => {
            console.log(`❌ ${file.assetPath}`);
        });

        // Hỏi xoá thật
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        readline.question('\n🔥 Bạn có muốn xoá các file này không? (y/n): ', answer => {
            if (answer.toLowerCase() === 'y') {
                unusedAssets.forEach(({ assetPath }) => {
                    fs.unlinkSync(assetPath);
                    const metaPath = assetPath + '.meta';
                    if (fs.existsSync(metaPath)) fs.unlinkSync(metaPath);
                });
                console.log('✅ Đã xoá tất cả file không dùng.');
            } else {
                console.log('❌ Đã huỷ xoá.');
            }
            readline.close();
        });
    } else {
        console.log('✅ Không có file rác nào.');
    }
}

main();
