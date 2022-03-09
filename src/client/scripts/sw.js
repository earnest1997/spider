var cacheKey = 'demo1';
var cacheList = [];
var imgSuffix = /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/;
var mediaSuffix = /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/;
var fontSuffix = /\.(woff2?|eot|ttf|otf)(\?.*)?$/;
var fileSuffix = /\.(js|css)$/;

cacheList = cacheList
  .filter((src) =>
    [imgSuffix, mediaSuffix, fontSuffix, fileSuffix].some((item) =>
      item.test(src)
    )
  )
  .map((src) => new URL(src, self.location).href);
console.log(cacheList);

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches
      .open(cacheKey)
      .then((caches) => {
        // 延迟install事件直至Cache初始化完成
        // add(request)
        // cache.add('/');
        // caches.delete('sw.js')
        // caches.delete('http://localhost:3001/sw.js')
        return Promise.all(
          cacheList.map((url) => {
            return new Promise((resolve) => {
              if (!caches.has(url)) {
                const req = new Request(url, { mode: 'no-cors' });
                fetch(req).then((res) => {
                  if (res?.status == 200) {
                    caches.put(url, res);
                  }
                  resolve();
                });
              } else {
                resolve();
              }
            });
          })
        );
      })
      .then(function () {
        // 强制跳过等待阶段,进入激活阶段
        self.skipWaiting();
      })
  );
});

// 如果是第一次加载sw，在安装后，会直接进入activated阶段(激活阶段)
self.addEventListener('activate', function (event) {
  // caches.delete(cacheKey)
  // 将一个 promise 传递到 event.waitUntil()，它将缓冲功能事件（fetch、push、sync 等），直到 promise 进行解析。
  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        console.log(keys, 'keys');
        return keys.map((key) => {
          // 构建产物有变化
          if (!cacheList.includes(key)) {
            return caches.delete(key); // 删除旧版本缓存
          }
        });
      })
      .then(() => {
        // `claim()` sets this worker as the active worker for all clients that
        // match the workers scope and triggers an `oncontrollerchange` event for
        // the clients.
        // 如果没有下面这一句 需要刷新 fetch监听的事件才会生效
        self.clients.claim();
      })
  );
});

function fallback(event) {
  var req = event.request.clone();
  console.log(req, 'url');
  return fetch(req)
    .then(function (res) {
      // type: basic cors error onpaque ...
      // 请求出错 直接返回响应
      if (res?.status !== 200 && res?.type !== 'basic') {
        return res;
      }
      var response = res.clone();
      console.log(req, 'ww');
      // 请求成功 如果在需要缓存的列表中的话就缓存起来（缓存打包生成的文件）
      caches.open(cacheKey).then((caches) => {
        // put(request,response)
        if (cacheList.some((item) => !caches.match(item))) {
          caches.put(req.url, response).catch((err) => {
            console.log(err, 'put err', caches.keys());
          });
        }
      });
      return res;
    })
    .catch((err) => {
      console.log(err, req, 'fetch err');
      // return new Request()
    });
}

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request.url).then((res) => {
      if (res) {
        //  返回命中缓存的资源
        console.log(res, event.request, 'req');
        return res;
      }
      //  没有命中缓存 向服务器发起请求
      return fallback(event);
    })
  );
});
