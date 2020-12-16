// キャッシュの名前
var CACHE_NAME = 'pwa-sample-caches';
// キャッシュするファイルを指定
var urlsToCache = [
  // "index.html",
  "hoge/index.html",
  "index.html"
];

// インストール処理
// 政情に登録されたときに走る
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

// リソースフェッチ時のキャッシュロード処理
self.addEventListener('fetch', function(event) {
  console.log(event.request);
  console.log(event.request.url);

  event.respondWith(
    caches
      .match(event.request)
      .then(function(response) {
        return response || fetch(event.request);
      })
  );
});