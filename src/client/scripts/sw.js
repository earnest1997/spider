const cacheKey = 'demo1';
let cacheList = [];
cacheList=cacheList.map(src=>new URL(src,self.location))
console.log(cacheList)

self.addEventListener('install', function (event) {
  self.skipWaiting()
  // event.waitUntil(
  //   caches.open(cacheKey).then((caches) => {
  //     // 延迟install事件直至Cache初始化完成
  //     // add(request)
  //     // cache.add('/');
  //     caches.delete('sw.js')
  //     caches.delete('http://localhost:3001/sw.js')
  //   })
  // );
});

// 如果是第一次加载sw，在安装后，会直接进入activated阶段(激活阶段)
self.addEventListener('activate', function (event) {
  // caches.delete(cacheKey)
  event.waitUntil(
    caches.keys().then((keys) => {
      console.log(keys,'keys')
      return keys.map((key) => {
        if (key !== cacheKey) {
          caches.delete(key); // 删除旧版本缓存
        }
      });
    })
  );
});

function fallback(event) {
  const url = event.request.clone();
  return fetch(url)
    .then(function (res) {
      // type: basic cors error onpaque ...
      if (res?.status !== 200 && res?.type !== 'basic') {
        return res;
      }
      const response = res.clone();
      console.log(url,'ww')
      caches.open(cacheKey).then((caches) => {
        // put(request,response)
        if (cacheList.some((item) => !caches.match(item))) {
          caches.put(event.request, response).catch((err) => {
            console.log(err, 'put err',caches.keys());
          });
        }
      });
      return res;
    })
    .catch((err) => {
      console.log(err, 'fetch err');
    });
}

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then((res) => {
      if (res) {
        //  返回命中缓存的资源
        console.log(res,event.request,'req')
        return res;
      }
      //  没有命中缓存
      return fallback(event);
    })
  );
});
