const fs = require("fs");
const path = require("path");

const ASSETS_DIR = path.join(__dirname, "../assets"); // Thay đường dẫn nếu cần

// Tìm tất cả file .meta chứa thông tin atlas
function collectAtlasUUIDs(dir) {
  let atlasUUIDs = new Set();

  function scan(folder) {
    const items = fs.readdirSync(folder);
    for (const item of items) {
      const fullPath = path.join(folder, item);
      if (fs.statSync(fullPath).isDirectory()) {
        scan(fullPath);
      } else if (item.endsWith(".meta")) {
        const content = fs.readFileSync(fullPath, "utf8");
        try {
          const meta = JSON.parse(content);
          if (meta.type === "sprite-atlas" && meta.subMetas) {
            Object.values(meta.subMetas).forEach((sub) => {
              atlasUUIDs.add(sub.uuid);
            });
          }
        } catch { }
      }
    }
  }

  scan(dir);
  return atlasUUIDs;
}

// Tìm file ảnh .png/.jpg có meta mà UUID không thuộc atlas
function auditAssets(dir, atlasUUIDs) {
  let report = [];

  function scan(folder) {
    const items = fs.readdirSync(folder);
    for (const item of items) {
      const fullPath = path.join(folder, item);
      if (fs.statSync(fullPath).isDirectory()) {
        scan(fullPath);
      } else if (item.match(/\.(png|jpg|jpeg)$/i)) {
        const metaPath = fullPath + ".meta";
        if (fs.existsSync(metaPath)) {
          const content = fs.readFileSync(metaPath, "utf8");
          try {
            const meta = JSON.parse(content);
            const uuid = meta.uuid || meta.rawTextureUuid;
            if (uuid && !atlasUUIDs.has(uuid)) {
              report.push({
                file: fullPath.replace(__dirname + "/../", ""),
                uuid,
              });
            }
          } catch { }
        }
      }
    }
  }

  scan(dir);
  return report;
}

// === Thực thi ===
const atlasUUIDs = collectAtlasUUIDs(ASSETS_DIR);
const result = auditAssets(ASSETS_DIR, atlasUUIDs);

console.log("🔎 Các ảnh dùng riêng, không nằm trong AutoAtlas:");
result.forEach(({ file, uuid }) => {
  console.log(`❌ ${file} (uuid: ${uuid})`);
});

console.log(`\n🧾 Tổng cộng: ${result.length} ảnh.`);
