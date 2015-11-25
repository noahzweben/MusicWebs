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
  if (isPlaying) pauseAll();
  navigator.getUserMedia({audio: true}, function(localMediaStream){
    mediaStream = localMediaStream;
    var mediaStreamSource = context.createMediaStreamSource(localMediaStream);
    rec = new Recorder(mediaStreamSource, {
      workerPath: '../static/js/recorderWorker.js' // 404 error without the dot dot --> ../
    });

    playCountdown();
    window.setTimeout(rec.record,3000);
    window.setTimeout(togglePlay,3000);
  }, function(err){
    console.log('Not supported');
  });
  layerStartTime = myTime;
}

function stop() {
  mediaStream.stop();
  rec.stop();
  togglePlay();

}


//Takes the recorded input from microphone and adds it to the buffer array so can be played.
//uses methods from recorder.js (https://github.com/jwagener/recorder.js).
function layerRecording() {
  //turns the recording into an wav file and then converts the wav into a audio buffer
  rec.exportWAV(function(wav) {
    var url = window.URL.createObjectURL(wav);
    wavBlob = wav;
    console.log(url);
    loadWave(url,layerStartTime);

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
  request.open("POST", path);
  request.send(postData);

  request.onreadystatechange = function() {
  if (request.readyState == 4) {
    var obj = JSON.parse(request.responseText);
    var url = obj.url;
    window.location = url;
    }
  }

}
