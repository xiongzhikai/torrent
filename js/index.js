var hash = 'F08D320A2FF8D3DC72FA7D37CEE8C7BA08097192'.toUpperCase();
// var parseTorrent = require('parse-torrent');
var WebTorrent = require('webtorrent');
const trackers = [
    'udp://tracker.openbittorrent.com', 
    'udp://tracker.publicbt.com', 
    'udp://tracker.istole.it',
    'udp://open.demonii.com',
    'udp://tracker.coppersurfer.tk',
    'wss://tracker.btorrent.xyz', 
    'wss://tracker.openwebtorrent.com', 
    'wss://tracker.fastcast.nz'
];
const rtcConfig = {
    'iceServers': [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' }
    ]
}
const torrentOpts = {
    announce: trackers,
    getAnnounceOpts: function(res) {
        // console.log('trcakers', res);
    }
}

const trackerOpts = {
    rtcConfig: rtcConfig,
    dht: true,
    webSeeds:true,
    trackers: trackers
}
// var torrentId = 'https://webtorrent.io/torrents/sintel.torrent';
var torrentId = 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com';
// var torrentId = 'http://demo.com:3000/torrent/sintel.torrent';
// var torrentId = 'http://demo.com:3000/torrent/T6Y4FG35S54U3CWSV2OPAXRQVXHZJ4WV.torrent';

// var torrentId = 'magnet:?xt=urn:btih:T6Y4FG35S54U3CWSV2OPAXRQVXHZJ4WV&dn=Sherlock.2x01.A.Scandal.In.Belgravia.HDTV.XviD-FoV';
// var torrentId = 'magnet:?xt=urn:btih:9FE16486D3AD63B7AE7C5CE67028FABD5A74921B&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337';
var client = new WebTorrent({
    tracker: trackerOpts
});
client.add(torrentId, torrentOpts, function(torrent) {
    // console.log('file', torrent)
    var arrName = [];
        // Torrents can contain many files. Let's use the .mp4 file
    var file = torrent.files.find(function(file) {
        arrName.push(file.name);
        return file.name.endsWith('.mp4')
    });
    // console.log(file)
    torrent.files.forEach(function(file) {
        file.getBlobURL(function(err, url) {
            if (err) return console.log(err.message);
        });
    })

    // Stream the file in the browser
    file.appendTo('#output', function(err, elem) {
        if (err) throw err // file failed to download or display in the DOM
        console.log('New DOM node with the content', elem)
    })

    // Trigger statistics refresh
    torrent.on('done', onDone)
    setInterval(onProgress, 500)
    onProgress()

    // Statistics
    function onProgress() {
        // Peers
        $numPeers.innerHTML = torrent.numPeers + (torrent.numPeers === 1 ? ' peer' : ' peers')

        // Progress
        var percent = Math.round(torrent.progress * 100 * 100) / 100
        $progressBar.style.width = percent + '%'
        $downloaded.innerHTML = prettyBytes(torrent.downloaded)
        $total.innerHTML = prettyBytes(torrent.length)

        // Remaining time
        var remaining
        if (torrent.done) {
            remaining = 'Done.'
        } else {
            remaining = moment.duration(torrent.timeRemaining / 1000, 'seconds').humanize()
            remaining = remaining[0].toUpperCase() + remaining.substring(1) + ' remaining.'
        }
        $remaining.innerHTML = remaining

        // Speed rates
        $downloadSpeed.innerHTML = prettyBytes(torrent.downloadSpeed) + '/s'
        $uploadSpeed.innerHTML = prettyBytes(torrent.uploadSpeed) + '/s'
    }

    function onDone() {
        $body.className += ' is-seed'
        onProgress()
    }
});
client.on('torrent', function(torrent) {
    // console.log('torrent', torrent.torrentFileBlobURL);
});
client.on('error', function(error) {
    console.log('error:', error);
})

// HTML elements
var $body = document.body
var $progressBar = document.querySelector('#progressBar')
var $numPeers = document.querySelector('#numPeers')
var $downloaded = document.querySelector('#downloaded')
var $total = document.querySelector('#total')
var $remaining = document.querySelector('#remaining')
var $uploadSpeed = document.querySelector('#uploadSpeed')
var $downloadSpeed = document.querySelector('#downloadSpeed')

// Download the torrent


// Human readable bytes util
function prettyBytes(num) {
    var exponent, unit, neg = num < 0,
        units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    if (neg) num = -num
    if (num < 1) return (neg ? '-' : '') + num + ' B'
    exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), units.length - 1)
    num = Number((num / Math.pow(1000, exponent)).toFixed(2))
    unit = units[exponent]
    return (neg ? '-' : '') + num + ' ' + unit
}
