/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/client/scripts/sw.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/client/scripts/sw.js":
/*!**********************************!*\
  !*** ./src/client/scripts/sw.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var cacheKey = 'demo1';
var cacheList =[".//fonts/ionicons.a558ac78.eot",".//img/ionicons.d6592091.svg",".//fonts/ionicons.ef4a9f28.ttf",".//fonts/ionicons.96f1c901.woff2",".//fonts/ionicons.99b86349.woff",".//img/banner.feb40727.jpg",".//img/favicon.d5b1dae9.ico","js/main.0eb67a71.js","favicon.ico","index.html"];
cacheList = cacheList.map(function (src) {
  return new URL(src, self.location).href;
});
console.log(cacheList);

if (false) {}

self.addEventListener('install', function (event) {
  console.log(88); // waitUnntil相当于new Promise 返回一个新的promise,这里就是一个串行的异步加载，当所有加载都成功时，那么 SW 就可以下一步。
  // 还有另外一个重要好处，它可以用来延长一个事件作用的时间，
  //这里特别针对于我们 SW 来说，比如我们使用 caches.open 是用来打开指定的缓存，但开启的时候，
  //并不是一下就能调用成功，也有可能有一定延迟，由于系统会随时睡眠 SW，所以，为了防止执行中断，
  //就需要使用 event.waitUntil 进行捕获。另外，event.waitUntil 会监听所有的异步 promise
  //如果其中一个 promise 是 reject 状态，那么该次 event 是失败的。这就导致，我们的 SW 开启失败。

  event.waitUntil(caches.open(cacheKey).then(function (cache) {
    // 延迟install事件直至Cache初始化完成
    // 将所有的静态资源加入到缓存中 注意并不适合做预加载 install可能在所有的请求之后
    console.log(cacheList, 'cnmm');
    return Promise.all(cacheList.map(function (url) {
      return cache.keys().then(function (cachedUrls) {
        console.log(cachedUrls, 'urls');

        if (!cachedUrls.includes(url)) {
          // 不发送跨域请求，因为可能会出错
          var req = new Request(url, {
            mode: 'no-cors'
          });
          return fetch(req).then(function (res) {
            if (res && res.status == 200) {
              // return Promise.resolve()
              console.log('put url', url);
              return cache.put(req, res);
            }
          });
        }
      });
    }));
  }).then(function () {
    console.log('skip waiting'); // 强制跳过等待阶段,进入激活阶段

    self.skipWaiting();
  }));
}); // 如果是第一次加载sw，在安装后，会直接进入activated阶段(激活阶段)

self.addEventListener('activate', function (event) {
  // caches.delete(cacheKey)
  //   将一个 promise 传递到 event.waitUntil()，它将缓冲功能事件（fetch、push、sync 等），直到 promise 进行解析。
  event.waitUntil(caches.open(cacheKey).then(function (cache) {
    return cache.keys().then(function (keys) {
      console.log(keys, 'keys');
      return keys.map(function (key) {
        // 构建产物有变化
        if (!cacheList.includes(key)) {
          return cache["delete"](key); // 删除不需要的缓存
        }
      });
    })["catch"](function (err) {
      console.log(err, 'keyerr');
    }).then(function () {
      // `claim()` sets this worker as the active worker for all clients that
      // match the workers scope and triggers an `oncontrollerchange` event for
      // the clients.
      // 如果没有下面这一句 需要刷新 fetch监听的事件才会生效
      self.clients.claim();
    });
  }));
});

function fallback(event) {
  var req = event.request.clone();
  return fetch(req).then(function (res) {
    // type: basic cors error onpaque ...
    // 请求出错 直接返回响应
    if (res && res.status !== 200 && res.type !== 'basic') {
      return res;
    }

    var response = res.clone();
    console.log(req, 'w99w'); // 请求成功 如果在需要缓存的列表中的话就缓存起来（缓存打包生成的文件）

    caches.open(cacheKey).then(function (cache) {
      if (cacheList.includes(req.url)) {
        console.log(req.url, 'put url');
        cache.put(req.url, response)["catch"](function (err) {
          console.log(err, 'put err', cache.keys());
        });
      }
    });
    return res;
  })["catch"](function (err) {
    console.log(err, req, 'fetch err'); // return new Request()
  });
}

self.addEventListener('fetch', function (event) {
  event.respondWith(caches.match(event.request).then(function (res) {
    if (res) {
      //  返回命中缓存的资源
      console.log(res, event.request, '命中');
      return res;
    }

    caches.open(cacheKey).then(function (cache) {
      cache.keys().then(function (keys) {
        console.log(keys, event.request.url, '未命中');
      });
    }); //  没有命中缓存 向服务器发起请求

    return fallback(event);
  }));
});

/***/ })

/******/ });
//# sourceMappingURL=sw.js.map