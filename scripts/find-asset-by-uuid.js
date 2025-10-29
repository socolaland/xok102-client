const fs = require('fs');
const path = require('path');

function extractUUIDs(text) {
  const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g;
  return text.match(uuidRegex) || [];
}

function getUUIDFromMeta(filePath) {
  const metaPath = filePath + '.meta';
  if (!fs.existsSync(metaPath)) return null;

  try {
    const metaContent = fs.readFileSync(metaPath, 'utf8');
    const json = JSON.parse(metaContent);
    return json.uuid || null;
  } catch (err) {
    return null;
  }
}

function findReferences(uuidList, rootPath) {
  const matchedFiles = [];
  const allowedExts = ['.prefab', '.scene', '.fire', '.json', '.anim', '.meta', '.ts', '.js'];

  function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (allowedExts.includes(path.extname(fullPath))) {
        const content = fs.readFileSync(fullPath, 'utf8');
        for (const uuid of uuidList) {
          if (content.includes(uuid)) {
            matchedFiles.push({ file: fullPath, uuid });
          }
        }
      }
    }
  }

  walk(rootPath);
  return matchedFiles;
}

// ========================= Main =============================

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('❗ Vui lòng truyền vào đường dẫn file:');
  console.error('   node find-references.js ./assets/images/logo.png');
  process.exit(1);
}

if (!fs.existsSync(inputPath)) {
  console.error('❌ File không tồn tại:', inputPath);
  process.exit(1);
}

let uuids = [];

if (inputPath.endsWith('.meta') || /\.(png|jpg|jpeg|mp3|ttf|fbx)$/.test(inputPath)) {
  const uuid = getUUIDFromMeta(inputPath);
  if (!uuid) {
    console.error('❌ Không lấy được UUID từ meta file.');
    process.exit(1);
  }
  uuids = [uuid];
  console.log(`📦 UUID từ file [${inputPath}]: ${uuid}`);
} else {
  const content = fs.readFileSync(inputPath, 'utf8');
  uuids = extractUUIDs(content);
  console.log(`📄 Tìm thấy ${uuids.length} UUID trong file.`);
}

const result = findReferences(uuids, path.resolve('./assets'));

if (result.length === 0) {
  console.log('🔍 Không tìm thấy file nào tham chiếu UUID.');
} else {
  console.log(`✅ Có ${result.length} file tham chiếu UUID:`);
  result.forEach(r => {
    console.log(`📁 ${r.file} (có UUID: ${r.uuid})`);
  });
}
