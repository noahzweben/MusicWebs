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
    $("#recordButton").text("Add Recording for New Track");


  } 
  else {
    record();
    isRecording = true;
    $("#recordButton").text("Stop Recording");

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
    disableRecord();
    window.setTimeout(rec.record,3000);
    window.setTimeout(disableRecord,3000);

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



function newUpload() {
  var trackName = $("#nameForm").val();
  var originalArtist = $("#artistForm").val();
  var isHidden = $("#hiddenBox").is(':checked');
  var myFile = document.getElementById("fileForm");



  isHidden = isHidden ? 1 : 0;
  
  if (trackName.length !=0 && originalArtist.length !=0 && ('files' in myFile) && myFile.files.length !=0){
    var postData = new FormData();
    console.log(trackName);

    postData.append("trackName", trackName);
    postData.append("originalArtist", originalArtist);
    postData.append("startTime", 0.0); 
    postData.append("layerFile", myFile.files[0]);
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
    $('#modal1').closeModal();
    $("#nameForm").css("border","1px solid red");
    $("#artistForm").css("border","1px solid red");

  }
}



function tempDiv() {
  $("#wave").removeClass("hide");
  $("#playButton").removeClass("hide");
  $("#playButton").text("Play");

  var div = document.createElement("div");
  div.innerText = "Temporary, delete or save before recording new layer"
  var container = document.getElementById("layerContainer");
  container.appendChild(div);
  var button = document.createElement("button");
  button.innerText = "Del";
  $(button).addClass("waves-effect waves-light btn-floating editButton"); 
  
  $(button).click(function(){
    waves[waves.length-1].destroy();
    $("#recordButton").prop("disabled",false);
    $(div).remove();
    $("#wave").css("display","none");
    $("#wave").addClass("hide");
    $("#playButton").addClass("hide");

    waves.pop();
    waveContainers.pop();waveContainers.pop();
  });

  var button2 = document.createElement("button");
  $(button2).addClass("waves-effect waves-light btn-floating editButton"); 

  button2.innerText = "Save Recording";
  $(button2).click(function(){
    newTrack();
    $("#recordButton").prop("disabled",false);
  });

  div.appendChild(button);
  div.appendChild(button2);
}


 function disableRecord(){
    $("#recordButton").prop("disabled",!($("#recordButton").prop("disabled")));
  }


  $(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal-trigger').leanModal();
  });