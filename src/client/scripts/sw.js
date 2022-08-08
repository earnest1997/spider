var cacheKey = 'demo1';
var cacheList = [];

cacheList = cacheList.map((src) => new URL(src, self.location).href);
console.log(cacheList);

if (module.hot) {  
  module.hot.accept();
 }
self.addEventListener('install', function (event) {
  console.log(88);
  // waitUnntil相当于new Promise 返回一个新的promise,这里就是一个串行的异步加载，当所有加载都成功时，那么 SW 就可以下一步。
  // 还有另外一个重要好处，它可以用来延长一个事件作用的时间，
  //这里特别针对于我们 SW 来说，比如我们使用 caches.open 是用来打开指定的缓存，但开启的时候，
  //并不是一下就能调用成功，也有可能有一定延迟，由于系统会随时睡眠 SW，所以，为了防止执行中断，
  //就需要使用 event.waitUntil 进行捕获。另外，event.waitUntil 会监听所有的异步 promise
  //如果其中一个 promise 是 reject 状态，那么该次 event 是失败的。这就导致，我们的 SW 开启失败。
  event.waitUntil(
    caches
      .open(cacheKey)
      .then((cache) => {
        // 延迟install事件直至Cache初始化完成
        // 将所有的静态资源加入到缓存中 注意并不适合做预加载 install可能在所有的请求之后
        console.log(cacheList,'cnmm')
        return Promise.all(
          cacheList.map((url) => {
            
            return cache.keys().then((cachedUrls) => {
              console.log(cachedUrls,'urls')
              if (!cachedUrls.includes(url)) {
                // 不发送跨域请求，因为可能会出错
                const req = new Request(url, { mode: 'no-cors' });
                return fetch(req).then((res) => {
                  if (res && res.status == 200) {
                    // return Promise.resolve()
                    console.log('put url',url)
                    return cache.put(req, res);
                  }
                });
              }
            });
          })
        );
      })
      .then(function () {
        console.log('skip waiting')
        // 强制跳过等待阶段,进入激活阶段
        self.skipWaiting();
      })
  );
});

// 如果是第一次加载sw，在安装后，会直接进入activated阶段(激活阶段)
self.addEventListener('activate', function (event) {
  // caches.delete(cacheKey)
  //   将一个 promise 传递到 event.waitUntil()，它将缓冲功能事件（fetch、push、sync 等），直到 promise 进行解析。
  event.waitUntil(
    caches.open(cacheKey).then((cache) =>
      cache
        .keys()
        .then((keys) => {
          console.log(keys, 'keys');
          return keys.map((key) => {
            // 构建产物有变化
            if (!cacheList.includes(key)) {
              return cache.delete(key); // 删除不需要的缓存
            }
          });
        })
        .catch((err) => {
          console.log(err, 'keyerr');
        })
        .then(() => {
          // `claim()` sets this worker as the active worker for all clients that
          // match the workers scope and triggers an `oncontrollerchange` event for
          // the clients.
          // 如果没有下面这一句 需要刷新 fetch监听的事件才会生效
          self.clients.claim();
        })
    )
  );
});

function fallback(event) {
  var req = event.request.clone();
  return fetch(req)
    .then(function (res) {
      // type: basic cors error onpaque ...
      // 请求出错 直接返回响应
      if (res && res.status !== 200 && res.type !== 'basic') {
        return res;
      }
      var response = res.clone();
      console.log(req, 'w99w');
      // 请求成功 如果在需要缓存的列表中的话就缓存起来（缓存打包生成的文件）
      caches.open(cacheKey).then((cache) => {
        if (cacheList.includes(req.url)) {
          console.log(req.url,'put url')
          cache.put(req.url, response).catch((err) => {
            console.log(err, 'put err', cache.keys());
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
    caches.match(event.request).then((res) => {
      if (res) {
        //  返回命中缓存的资源
        console.log(res, event.request, '命中');
        return res;
      }
      caches.open(cacheKey).then((cache) => {
        cache.keys().then(keys=>{
          console.log(keys,event.request.url,'未命中')
        })
      
      })
      //  没有命中缓存 向服务器发起请求
      return fallback(event);
    })
  );
});
