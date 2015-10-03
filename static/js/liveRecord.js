var navigator = window.navigator;
var Context = window.AudioContext || window.webkitAudioContext;
var context = new Context();

// audio
var mediaStream;
var rec;

// video
var videoMediaStream;
var video;

navigator.getUserMedia = (
  navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia
);

function record() {
  navigator.getUserMedia({audio: true}, function(localMediaStream){
    mediaStream = localMediaStream;
    var mediaStreamSource = context.createMediaStreamSource(localMediaStream);
    rec = new Recorder(mediaStreamSource, {
      workerPath: 'static/js/recorderWorker.js'
    });

    rec.record();
    startNow();
  }, function(err){
    console.log('Not supported');
  });
}

function stop() {
  mediaStream.stop();
  rec.stop();
  stopNow();

  rec.exportWAV(function(e){
    rec.clear();
    Recorder.forceDownload(e, "test.wav");
  });
}
