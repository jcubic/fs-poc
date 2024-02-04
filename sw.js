importScripts(
    'https://cdn.jsdelivr.net/npm/@jcubic/wayne/index.umd.js',
    'https://cdn.jsdelivr.net/npm/idb-keyval/dist/umd.js',
    'https://cdn.jsdelivr.net/npm/@isomorphic-git/lightning-fs@4.6.0/dist/lightning-fs.min.js',
    'https://cdn.jsdelivr.net/npm/browserfs/dist/browserfs.js',
    'https://cdn.jsdelivr.net/gh/jcubic/static@master/js/path.js',
    'https://cdn.jsdelivr.net/gh/jcubic/static@master/js/mime.min.js'
);

const path = BrowserFS.BFSRequire('path');
const fs = new Promise(function(resolve, reject) {
    BrowserFS.configure({ fs: 'IndexedDB', options: {} }, function (err) {
        if (err) {
            reject(err);
        } else {
            resolve(BrowserFS.BFSRequire('fs'));
        }
    });
});


fs.then(fs => {
    const app = new wayne.Wayne();
    const test = url => {
        if (url.host !== self.location.hostname) {
            return false;
        }
        const path = url.pathname;
        console.log({path});
        return !path.match(/admin|sw.js/) && !path.startsWith('/content');
    };

    const dir = async () => {
        const dir = await idbKeyval.get('__dir__');
        return dir ?? '/';
    };

    app.use(wayne.FileSystem({ path, fs, mime, dir, test }));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});
