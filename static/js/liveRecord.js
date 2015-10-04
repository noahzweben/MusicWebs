var navigator = window.navigator;


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

    playCountdown();
    window.setTimeout(rec.record,3000);
    window.setTimeout(startNow,3000);
  }, function(err){
    console.log('Not supported');
  });
}

function stop() {
  mediaStream.stop();
  rec.stop();
  stopNow();



  // rec.exportWAV(function(e){
  //   rec.clear();
  //   Recorder.forceDownload(e, "test.wav");
  // });
}


var playbackRecorderAudio = function () {
    rec.getBuffer(function (buffers) {
    var source = context.createBufferSource();
    source.buffer = context.createBuffer(1, buffers[0].length, 44100);
    source.buffer.getChannelData(0).set(buffers[0]);
    source.buffer.getChannelData(0).set(buffers[1]);
    source.connect(context.destination);
    source.start(0);
  });
}

function layerRecording() {
  var newBuffer;
  rec.exportWAV(function(wav) {
  var url = window.URL.createObjectURL(wav);
  console.log(url);
  var getSound = new XMLHttpRequest(); // Load the Sound with XMLHttpRequest
  getSound.open("GET", url, true);
  getSound.responseType = "arraybuffer"; // Read as Binary Data
  getSound.onload = function() {
    context.decodeAudioData(getSound.response, function(buffer){
      newBuffer = buffer; // Decode the Audio Data and Store it in a Variable
      buffers.push(newBuffer);
    });
    
  }
  getSound.send(); // Send the Request and Load the File
});
}
