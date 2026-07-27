const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const images = [
  {
    name: 'dali.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Erhai_Lake_Dali.jpg/800px-Erhai_Lake_Dali.jpg'
  },
  {
    name: 'chengdu.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Chengdu_Tianfu_Square.jpg/800px-Chengdu_Tianfu_Square.jpg'
  },
  {
    name: 'xiamen.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Xiamen_Gulangyu_2.jpg/800px-Xiamen_Gulangyu_2.jpg'
  },
  {
    name: 'nanjing.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Nanjing_Xuanwu_Lake.jpg/800px-Nanjing_Xuanwu_Lake.jpg'
  },
  {
    name: 'xian.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Xi%27an_Bell_Tower.jpg/800px-Xi%27an_Bell_Tower.jpg'
  },
  {
    name: 'shanghai.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Shanghai_skyline_from_the_Bund.jpg/800px-Shanghai_skyline_from_the_Bund.jpg'
  },
  {
    name: 'hangzhou.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Hangzhou_West_Lake.jpg/800px-Hangzhou_West_Lake.jpg'
  },
  {
    name: 'kunming.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Kunming_Green_Lake_Park.jpg/800px-Kunming_Green_Lake_Park.jpg'
  }
];

const dir = path.join(__dirname, 'images');
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const client = url.startsWith('https') ? https : http;
    client.get(url, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', err => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

(async () => {
  for (const img of images) {
    const dest = path.join(dir, img.name);
    process.stdout.write(`下载 ${img.name} ...`);
    try {
      await download(img.url, dest);
      console.log(' ✓');
    } catch (e) {
      console.log(` ✗ ${e.message}`);
    }
  }
  console.log('完成');
})();
