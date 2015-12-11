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
  mediaStream.active = false;
  rec.stop();
  playBack();
  tempDiv();
  $("#recordButton").prop("disabled",true);
}



function playBack() {
  //turns the recording into an wav file and then converts the wav into a audio buffer
  rec.exportWAV(function(wav) {
    var url = window.URL.createObjectURL(wav);
    wavBlob = wav;
    $("#wave").css("display","inline-block");
    loadWave(url,0);
    waves[waves.length-1].on("ready",alignWaves);
    waves[waves.length-1].on("ready",setSeek);
});
}


function newTrack() {
  var trackName = $("#nameForm").val();
  var originalArtist = $("#artistForm").val();
  var isHidden = $("#hiddenBox").is(':checked');
  isHidden = isHidden ? 1 : 0;
  
  if (trackName.length !=0 && originalArtist.length !=0){
    var postData = new FormData();
    console.log(trackName);

    postData.append("trackName", trackName);
    postData.append("originalArtist", originalArtist);
    postData.append("startTime", 0.0); 
    postData.append("layerFile", wavBlob);
    postData.append("isHidden", isHidden);

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
    $("#artistForm").css("border","1px solid red");

  }
}




function tempDiv() {
  var div = document.createElement("div");
  div.innerText = "Temporary, delete or save before recording new layer"
  var container = document.getElementById("container");
  container.appendChild(div);
  var button = document.createElement("button");
  button.innerText = "Delete Recording";
  
  $(button).click(function(){
    waves[waves.length-1].destroy();
    $("#recordButton").prop("disabled",false);
    $(div).remove();
    $("#wave").css("display","none");

    waves.pop();
    waveContainers.pop();waveContainers.pop();
  });

  var button2 = document.createElement("button");
  button2.innerText = "Save Recording";
  $(button2).click(function(){
    newTrack();
    $("#recordButton").prop("disabled",false);
  });

  div.appendChild(button);
  div.appendChild(button2);
}