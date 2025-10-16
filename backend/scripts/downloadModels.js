const https = require('https');
const fs = require('fs');
const path = require('path');

const modelDir = path.join(__dirname, '../models');

// モデルファイルのURL (vladmandic版のface-apiを使用)
const modelFiles = [
  {
    url: 'https://vladmandic.github.io/face-api/model/ssdMobilenetv1Manifest.json',
    name: 'ssd_mobilenetv1_model-weights_manifest.json'
  },
  {
    url: 'https://vladmandic.github.io/face-api/model/ssdMobilenetv1Shard1',
    name: 'ssd_mobilenetv1_model-shard1'
  },
  {
    url: 'https://vladmandic.github.io/face-api/model/ssdMobilenetv1Shard2',
    name: 'ssd_mobilenetv1_model-shard2'
  },
];

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function downloadModels() {
  console.log('📥 顔検出モデルファイルをダウンロード中...\n');

  // modelsディレクトリが存在しない場合は作成
  if (!fs.existsSync(modelDir)) {
    fs.mkdirSync(modelDir, { recursive: true });
  }

  for (const file of modelFiles) {
    const dest = path.join(modelDir, file.name);

    try {
      console.log(`⬇️  ${file.name} をダウンロード中...`);
      await downloadFile(file.url, dest);
      console.log(`✅ ${file.name} ダウンロード完了`);
    } catch (error) {
      console.error(`❌ ${file.name} のダウンロードに失敗:`, error.message);
      process.exit(1);
    }
  }

  console.log('\n✅ すべてのモデルファイルのダウンロードが完了しました！');
  console.log('🎉 顔検出機能が有効になりました。サーバーを再起動してください。');
}

downloadModels();
