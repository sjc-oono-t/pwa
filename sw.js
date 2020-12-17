// キャッシュの名前
const NAME = 'pwa-sample-caches-';
const VERSION = '043';
const CACHE_NAME = NAME + VERSION;
// キャッシュするファイルを指定
var urlsToCache = [
  "index.html",
//   "hoge/index.html",
  "fuga/index.html"
];

// // インストール処理
// // 正常に登録されたときに走る
// self.addEventListener('install', function(event) {
//   console.log("---------------");
//   console.log("----install----");
//   console.log("---------------");
//   event.waitUntil(
//     caches
//       .open(CACHE_NAME)
//       .then(function(cache) {
//         return cache.addAll(urlsToCache);
//       })
//   );
// });

self.addEventListener('install', (event) => {
//   console.log("---------------");
//   console.log("----install---");
//   console.log("---------------");
  event.waitUntil(
      caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');

                // 指定されたリソースをキャッシュに追加する
                return cache.addAll(urlsToCache);
            })
  );
});

// // リソースフェッチ時のキャッシュロード処理
// self.addEventListener('fetch', function(event) {
//   console.log("---------------");
//   console.log("-----fetch-----");
//   console.log("---------------");
//   event.respondWith(
//     caches.open(CACHE_NAME).then(function(cache) {
//       return cache.match(event.request)
//       .then(function(response) {
//         return response || fetch(event.request);
//       });
//     })
//   );
// });

// // Cache Storage にキャッシュされているサービスワーカーのkeyに変更があった場合
// // 新バージョンをインストール後、旧バージョンのキャッシュを削除する
// // (このファイルでは CACHE_NAME をkeyの値とみなし、変更を検知している)
// self.addEventListener('activate', event => {
//   console.log("---------------");
//   console.log("----activate---");
//   console.log("---------------");
//   event.waitUntil(
//     caches.keys().then(keys => Promise.all(
//       keys.map(key => {
//         if (!CACHE_NAME.includes(key)) {
//           return caches.delete(key);
//         }
//       })
//     )).then(() => {
//       console.log(CACHE_NAME + "activated");
//     })
//   );
// });

// self.addEventListener('activate', function(event) {
//   event.waitUntil(
//     caches.keys().then(function(cacheNames) {
//       return Promise.all(
//         cacheNames.filter(function(cacheName) {
//           return cacheName !== CACHE_NAME;
//         }).map(function(cacheName) {
//           return caches.delete(cacheName);
//         })
//       );
//     })
//   );
// });

self.addEventListener('activate', (event) => {
//   console.log("---------------");
//   console.log("----activate---");
//   console.log("---------------");
  var cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
      caches.keys().then((cacheNames) => {
          return Promise.all(
              cacheNames.map((cacheName) => {
                  // ホワイトリストにないキャッシュ(古いキャッシュ)は削除する
                  if (cacheWhitelist.indexOf(cacheName) === -1) {
                      return caches.delete(cacheName);
                  }
              })
          );
      })
  );
});

self.addEventListener('fetch', (event) => {
//   console.log("---------------");
//   console.log("----fetch---");
//   console.log("---------------");
  event.respondWith(
      caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }

                // 重要：リクエストを clone する。リクエストは Stream なので
                // 一度しか処理できない。ここではキャッシュ用、fetch 用と2回
                // 必要なので、リクエストは clone しないといけない
                let fetchRequest = event.request.clone();

                return fetch(fetchRequest)
                    .then((response) => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // 重要：レスポンスを clone する。レスポンスは Stream で
                        // ブラウザ用とキャッシュ用の2回必要。なので clone して
                        // 2つの Stream があるようにする
                        let responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                              .then((cache) => {
                                  cache.put(event.request, responseToCache);
                              });

                        return response;
                    });
            })
  );
});
