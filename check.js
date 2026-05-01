const fs = require('fs');
const https = require('https');

const data = fs.readFileSync('data.js', 'utf8');
const urls = [...data.matchAll(/"(https:\/\/images\.unsplash\.com\/photo-[^"]+)"/g)].map(m => m[1]);

async function checkUrl(url) {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            if (res.statusCode === 404) {
                resolve(url);
            } else if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                // follow redirect
                https.get(res.headers.location, (res2) => {
                    resolve(res2.statusCode === 404 ? url : null);
                }).on('error', () => resolve(url));
            } else {
                resolve(null);
            }
        }).on('error', () => resolve(url));
    });
}

async function run() {
    const results = await Promise.all(urls.map(url => checkUrl(url)));
    const badUrls = results.filter(Boolean);
    console.log("Dead URLs:");
    badUrls.forEach(url => console.log(url));
}
run();
