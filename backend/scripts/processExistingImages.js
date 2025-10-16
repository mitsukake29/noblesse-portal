const fs = require('fs');
const path = require('path');
const { processImageWithFaceBlur } = require('../utils/faceDetection');

const originalDir = path.join(__dirname, '../uploads/original');
const blurredDir = path.join(__dirname, '../uploads/blurred');

async function processAllImages() {
  try {
    console.log('📸 既存画像のぼかし処理を開始します...');

    // originalディレクトリの全画像を取得
    const files = fs.readdirSync(originalDir);
    const imageFiles = files.filter(file => /\.(jpg|jpeg|png)$/i.test(file));

    console.log(`🔍 ${imageFiles.length}枚の画像が見つかりました`);

    for (let i = 0; i < imageFiles.length; i++) {
      const fileName = imageFiles[i];
      const originalPath = path.join(originalDir, fileName);
      const blurredPath = path.join(blurredDir, fileName);

      console.log(`\n[${i + 1}/${imageFiles.length}] ${fileName} を処理中...`);

      // ぼかし処理を実行
      await processImageWithFaceBlur(originalPath, blurredPath);
    }

    console.log('\n✅ すべての画像の処理が完了しました！');
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

processAllImages();
