const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './public/pictures';
const QUALITY_JPEG = 80;
const QUALITY_PNG = 80;

async function run() {
    const files = fs.readdirSync(inputDir);
    let saved = 0;
    let processed = 0;

    for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        const inputPath = path.join(inputDir, file);
        if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue;

        try {
            const before = fs.statSync(inputPath).size;
            let buf;

            if (ext === '.jpg' || ext === '.jpeg') {
                buf = await sharp(inputPath)
                    .jpeg({ quality: QUALITY_JPEG, mozjpeg: true })
                    .toBuffer();
            } else {
                buf = await sharp(inputPath)
                    .png({ quality: QUALITY_PNG, compressionLevel: 9 })
                    .toBuffer();
            }

            fs.writeFileSync(inputPath, buf);
            const after = fs.statSync(inputPath).size;
            const reduction = ((1 - after / before) * 100).toFixed(1);
            saved += (before - after);
            processed++;
            console.log(`✅ ${file}: ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB (-${reduction}%)`);
        } catch (err) {
            console.error(`❌ ${file}: ${err.message}`);
        }
    }

    console.log(`\n🎉 Done! Optimized ${processed} files. Total saved: ${(saved / 1024 / 1024).toFixed(2)}MB`);
}

run();
