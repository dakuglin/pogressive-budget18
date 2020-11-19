// Where data lives with no internet connection
const CACHE_NAME = "my-site-cache-v1";
const DATA_CACHE_NAME = "data-cache-v1";

// Array of all urls that our PWA should cache
const urlsToCache = [
  "/",
  "/db.js",
  "/index.js",
  "/manifest.json",
  "/styles.css",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png"
];

self.addEventListener("install", function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// tells the service worker to listen for any events where a fetch (api call) is being made
self.addEventListener("fetch", function(event) {
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then(cache => {

        // fetch normally.
        return fetch(event.request)
          .then(response => {
            if (response.status === 200) {
              cache.put(event.request.url, response.clone());
            }

            return response;
          })

          // if the fetch fails
          .catch(err => {
            // Network request failed
            return cache.match(event.request);
          });
      }).catch(err => console.log(err))
    );

    return;
  }

  // This code block handles all home page calls
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request).then(function(response) {
        if (response) {
          return response;
        } else if (event.request.headers.get("accept").includes("text/html")) {
          // return the cached home page 
          return caches.match("/");
        }
      });
    })
  );
});







// var CACHE_NAME = "my-site-cache-v1";
// const DATA_CACHE_NAME = "data-cache-v1";
// var urlsToCache = [
//   "/",
//   "/db.js",
//   "/index.js",
//   "/manifest.json",
//   "/styles.css",
//   "/icons/icon-192x192.png",
//   "/icons/icon-512x512.png"
// ];
// self.addEventListener("install", function(event) {
//   // Perform install steps
//   event.waitUntil(
//     caches.open(CACHE_NAME).then(function(cache) {
//       console.log("Opened cache");
//       return cache.addAll(urlsToCache);
//     })
//   );
// });
// self.addEventListener("fetch", function(event) {
//   // cache all get requests to /api routes
//   if (event.request.url.includes("/api/")) {
//     event.respondWith(
//       caches.open(DATA_CACHE_NAME).then(cache => {
//         return fetch(event.request)
//           .then(response => {
//             // If the response was good, clone it and store it in the cache.
//             if (response.status === 200) {
//               cache.put(event.request.url, response.clone());
//             }
//             return response;
//           })
//           .catch(err => {
//             // Network request failed, try to get it from the cache.
//             return cache.match(event.request);
//           });
//       }).catch(err => console.log(err))
//     );
//     return;
//   }
//   event.respondWith(
//     fetch(event.request).catch(function() {
//       return caches.match(event.request).then(function(response) {
//         if (response) {
//           return response;
//         } else if (event.request.headers.get("accept").includes("text/html")) {
//           // return the cached home page for all requests for html pages
//           return caches.match("/");
//         }
//       });
//     })
//   );
// });