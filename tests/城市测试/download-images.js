const https = require('https');
const fs = require('fs');
const path = require('path');

// 使用 picsum 占位图 + 真实城市图片备选
// 先用 picsum 验证流程，再换真实图
const images = [
  { name: 'dali.jpg',     id: 10  },
  { name: 'chengdu.jpg',  id: 20  },
  { name: 'xiamen.jpg',   id: 30  },
  { name: 'nanjing.jpg',  id: 40  },
  { name: 'xian.jpg',     id: 50  },
  { name: 'shanghai.jpg', id: 60  },
  { name: 'hangzhou.jpg', id: 70  },
  { name: 'kunming.jpg',  id: 80  },
];

const dir = path.join(__dirname, 'images');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        return reject(new Error('HTTP ' + res.statusCode));
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
    const url = `https://picsum.photos/id/${img.id}/800/500`;
    process.stdout.write(`下载 ${img.name} ...`);
    try {
      await download(url, dest);
      const size = fs.statSync(dest).size;
      console.log(` ✓ ${Math.round(size/1024)}KB`);
    } catch (e) {
      console.log(` ✗ ${e.message}`);
    }
  }
  console.log('完成');
})();
