var navigator = window.navigator;


// audio
var mediaStream;
var rec;
var wavBlob;
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

  } 
  else {
    record();
    isRecording = true;
  }
}



function record() {
  navigator.getUserMedia({audio: true}, function(localMediaStream){
    mediaStream = localMediaStream;
    var mediaStreamSource = context.createMediaStreamSource(localMediaStream);
    rec = new Recorder(mediaStreamSource, {
      workerPath: '../static/js/recorderWorker.js' // 404 error without ../
    });

    playCountdown();
    window.setTimeout(rec.record,3000);
  }, function(err){
    console.log('Not supported');
  });
}

function stop() {
  mediaStream.stop();
  rec.stop();
  playBack();
}



function playBack() {
  //turns the recording into an wav file and then converts the wav into a audio buffer
  rec.exportWAV(function(wav) {
    var url = window.URL.createObjectURL(wav);
    wavBlob = wav;
    loadWave(url,0);
});
}


function newTrack() {
  var trackName = $("#nameForm").val();
  if (trackName.length !=0){
    var postData = new FormData();
    console.log(trackName);

    postData.append("trackName", trackName);
    postData.append("startTime", 0.0); 
    postData.append("layerFile", wavBlob);

    var request = new XMLHttpRequest();
    var path = "/track/new";
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
  else {
    $("#nameForm").css("border","1px solid red");

  }
}
