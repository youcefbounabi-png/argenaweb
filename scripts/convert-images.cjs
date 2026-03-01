const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../public/pictures');

fs.readdir(dir, (err, files) => {
    if (err) throw err;

    files.forEach(file => {
        if (file.match(/\.(png|jpg|jpeg)$/i)) {
            const ext = path.extname(file);
            const basename = path.basename(file, ext);
            const inputPath = path.join(dir, file);
            const outputPath = path.join(dir, `${basename}.webp`);

            sharp(inputPath)
                .webp({ quality: 80 })
                .toFile(outputPath)
                .then(() => {
                    console.log(`Converted ${file} to ${basename}.webp`);
                    // Optionally delete the original file
                    // fs.unlinkSync(inputPath);
                })
                .catch(err => {
                    console.error(`Error converting ${file}:`, err);
                });
        }
    });
});
