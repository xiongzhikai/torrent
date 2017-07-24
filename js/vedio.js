var playAttrInWechat = '';
var ua = navigator.userAgent.toLowerCase();
if (ua.match(/MicroMessenger/i) == "micromessenger") {
    playAttrInWechat = 'x5-video-player-type="h5"';
}

var video = '<video id="videoPlay" class="video-js vjs-default-skin vjs-big-play-centered" controls preload="auto" webkit-playsinline="true" x-webkit-airplay="true" ' +
    'poster="" data-setup="{}"' + playAttrInWechat + ' >' +
    '<source src="http://live.cloudp.cc/shayu/stream1_sd/playlist.m3u8" type="application/x-mpegURL">' +
    '</video>';
$('#live').click(function() {
    if ($('#J-play').find('video').length <= 0) {
        $('#J-play').html(video);
    }
    var myVideo = videojs('videoPlay', {}, function() {
        // console.log(this)
        // alert(JSON.stringify(this));
        this.play();
    });
    myVideo.on('play', function(e) {
        e.stopPropagation();
    });
});