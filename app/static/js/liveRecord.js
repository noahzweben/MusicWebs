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
    toggleInteract();
    isRecording = false;
    $("#playButton").prop("disabled",false);
    $("#recordButton").text("Start Recording");

  } 
  else {
    record();
    toggleInteract();
    isRecording = true;
    $("#playButton").prop("disabled",true);
    $("#recordButton").text("Stop Recording");

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
    disableRecord();
    window.setTimeout(rec.record,3000);
    window.setTimeout(togglePlay,3000);
    window.setTimeout(disableRecord,3000);

  }, function(err){
    console.log('Not supported');
  });
  layerStartTime = myTime;
}

function stop() {
  mediaStream.active=false;
  rec.stop();
  togglePlay();
  layerRecording();
  $("#recordButton").prop("disabled",true);

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
    waves[waves.length-1].on("ready",alignWaves);
    waves[waves.length-1].on("ready",setSeek);
    tempDiv();

  });
}



function postLayer() {
  var postData = new FormData();
  var layerName = $("#layerName").val();

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

///////
function tempDiv() {
  var div = document.createElement("div");
  div.innerText = "Temporary, delete or save before recording new layer"
  var container = document.getElementById("layerContainer");
  container.appendChild(div);
  var button = document.createElement("button");
  $(button).addClass("waves-effect waves-light btn-floating editButton-impt");
  button.innerText = "Del";
  
  $(button).click(function(){
    waves[waves.length-1].destroy();
    $("#recordButton").prop("disabled",false);
    $(div).remove();
    waves.pop();
    waveContainers.pop();waveContainers.pop();
  });

  var button2 = document.createElement("button");
  button2.innerText = "Save";
  $(button2).addClass("waves-effect waves-light btn-floating editButton-impt");
  $(button2).click(function(){
    $('#modal1').openModal();
    $("#recordButton").prop("disabled",false);
  });

  div.appendChild(button);
  div.appendChild(button2);
}
////


  $(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal-trigger').leanModal();
  });

  function disableRecord(){
    $("#recordButton").prop("disabled",!($("#recordButton").prop("disabled")));
  }


