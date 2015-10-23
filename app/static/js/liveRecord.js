var navigator = window.navigator;


// audio
var mediaStream;
var rec;
var wavBlob;
var layerStartTime;
var isRecording=false;


navigator.getUserMedia = (
  navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia
);


function toggleRecord(){
  if (isRecording) {
    stop();
    isRecording = false;
    $("#playButton").prop("disabled",false);

  } 
  else {
    record();
    isRecording = true;
    $("#playButton").prop("disabled",true);
  }
}



function record() {
  if (isPlaying) stopAll(sourceList);
  navigator.getUserMedia({audio: true}, function(localMediaStream){
    mediaStream = localMediaStream;
    var mediaStreamSource = context.createMediaStreamSource(localMediaStream);
    rec = new Recorder(mediaStreamSource, {
      workerPath: '../static/js/recorderWorker.js' // 404 error without ../
    });

    playCountdown();
    window.setTimeout(rec.record,3000);
    window.setTimeout(togglePlay,3000);
  }, function(err){
    console.log('Not supported');
  });
  layerStartTime = startOffset;
}

function stop() {
  mediaStream.stop();
  rec.stop();
  togglePlay();

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

//Takes the recorded input from microphone and adds it to the buffer array so can be played.
//uses methods from recorder.js (https://github.com/jwagener/recorder.js).
function layerRecording() {
  var newBuffer;
  //turns the recording into an wav file and then converts the wav into a audio buffer
  rec.exportWAV(function(wav) {
    var url = window.URL.createObjectURL(wav);
    wavBlob = wav;
    console.log(url);
    console.log('hi');
    var getSound = new XMLHttpRequest(); // Load the Sound with XMLHttpRequest
    getSound.open("GET", url, true);
    getSound.responseType = "arraybuffer"; // Read as Binary Data
    getSound.onload = function() {
      context.decodeAudioData(getSound.response, function(buffer){
      newBuffer = buffer; // Decode the Audio Data and Store it in a Variable
      buffers.push([newBuffer,layerStartTime]); //adds the new audio along with the startTime
    });
    
  }
    getSound.send(); // Send the Request and Load the File
});
}


function postLayer() {

  var postData = new FormData();
  var layerName = prompt("Enter Layer Name: i.e. Tenor Harmony");

  postData.append("layerName", layerName);
  postData.append("startTime", layerStartTime); 
  postData.append("layerFile", wavBlob);

  var request = new XMLHttpRequest();
  var id = $('.js-data').data('id');
  var path = "/track/save/"+id;
  cons
  request.open("POST", path);
  request.send(postData);

}
