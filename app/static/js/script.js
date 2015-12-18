var context;
var waves = [];
var waveContainers = [];
var timeOuts = [];
var maxDuration = 0;
var myTime =0;
var waveDiv = document.getElementById('wave');
var isPlaying = false;
var MIN_PX = 7;
var startTimes =[];
var sourcePaths=[];

// Init & load audio file


document.addEventListener('DOMContentLoaded', loadWaves);
window.setTimeout(alignWaves,1000);


function loadWaves() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();


    sourcePaths = grabListData(".path", false );
    startTimes = grabListData(".startTime", true);

    for (var i=0;i<sourcePaths.length;i++) {
        loadWave(sourcePaths[i],startTimes[i]); 
    }

    if (waves.length>0) {        
        waves[waves.length-1].on("ready",alignWaves);
        waves[waves.length-1].on("ready",setSeek);
        waves[waves.length-1].on("ready",addMute);

    }

    loadBeep();
}



function loadWave(path, startTime) {
    var wavesurfer = Object.create(WaveSurfer);
    var waveContainer = makeContainer(startTime);
    waveContainers.push(waveContainer);
    
     var options = {
        audioContext  : context,
        container     : waveContainer,
        waveColor     : '#ff856f',
        progressColor : '#ce1886',
        cursorColor   : '#ce1886',
        cursorWidth   : 1.5,
        height        : 100, 
        fillParent    : false,
        minPxPerSec   : MIN_PX,
        //interact      : false,
    };

    if (location.search.match('scroll')) {
        options.minPxPerSec = 100;
        options.scrollParent = true;
    }
    // Init
    wavesurfer.init(options);
    wavesurfer.load(path);
    wavesurfer.startTime = startTime;
   // wavesurfer.on("seek", setTime)
    waves.push(wavesurfer);
}


function makeContainer(startTime) {
    var div = document.createElement("div");
    div.class = "waveContainer";
    div.style.width = '100%';
    div.style.paddingLeft = "7px";
    div.style.opacity = 1;
    waveDiv.appendChild(div);
    waveContainers.push(div);
    return div;
}


function playAll(playTime) {
    alignWaves();
    restartAll();
    isPlaying = true;
    for (var i=0; i<waves.length; i++){

        //skip ahead, because playTime is above startTime
        if (playTime >= waves[i].startTime) {
            var beginAt = playTime-waves[i].startTime;
            if (beginAt < waves[i].getDuration()) waves[i].play(beginAt);
            else waves[i].play(waves[i].getDuration()-.01); // jumps to end

        }

        else {
            var delay = (waves[i].startTime-playTime)*1000;
            timeOuts.push(window.setTimeout(function() {
                this.play();
            }.bind(waves[i]),
            delay));
            waves[i].seekTo(0);
        }
    }
}

function seekAll(toTime) {
    for (var i=0;i<waves.length;i++) {
        var goTo = toTime-waves[i].startTime;
        goTo = Math.max(goTo,0);
        goTo = Math.min(goTo/waves[i].getDuration(),1);
        waves[i].seekTo(goTo);
    }
}

function pauseAll() {
    var pauseTime = 0;
    isPlaying = false;
    removeDelayed();
    for (var i=0; i<waves.length; i++){
        if (waves[i].isPlaying()){
            waves[i].pause();
            pauseTime = Math.max(pauseTime,waves[i].getCurrentTime()+waves[i].startTime);
    }
}
    myTime = pauseTime;  
}

function resumeAll(playTime) {
    isPlaying = true;
    for (var i=0; i<waves.length; i++){
        waves[i].play();
    }
}


function restartAll() {
    isPlaying=false;
    removeDelayed();
    for (var i=0; i<waves.length; i++){
        if (waves[i].isPlaying()) waves[i].stop();    
    }
}

function removeDelayed(){
    for (var i = 0; i < timeOuts.length; i++) {clearTimeout(timeOuts[i]);}
    timeOuts = [];
}

function alignWaves(){
    setMaxDuration();
    for (var i =0; i<waveContainers.length; i=i+2) {
        waveContainers[i].style.width = waves[i/2].getDuration()/maxDuration*100+"%";
        waveContainers[i].style.marginLeft = waves[i/2].startTime*MIN_PX+"px";
    }
    $('#wave').css('width',maxDuration*(1+MIN_PX)+"px");
}



function setMaxDuration() {
    for (var i =0;i<waves.length;i++) {
        maxDuration = Math.max(maxDuration,waves[i].getDuration());
    }
}

function setSeek() {
    for (var i =0;i<waves.length;i++) {
        waves[i].on('allSeek',function (percentage) {
            myTime = percentage*(this.getDuration())+this.startTime;
            var wasPlaying = isPlaying;
            if (wasPlaying)playAll(myTime);
            else seekAll(myTime);
        }.bind(waves[i]));
    }
}








/// Helper Functions ///
function grabListData(className, isNumber){
        var listData = [];
        $(className).each(function(){
            data = $(this).text();
            if (isNumber) data = parseFloat(data); 
            listData.push(data);
        });
        return listData
    }

function togglePlay(){
    if (!isPlaying) {
        playAll(myTime);
        $("#playButton").text("Pause");
    }
        else {
        pauseAll();
        $("#playButton").text("Play");
    }
}


$(document).keypress(function(e) {
    if(e.which == 32) {
      togglePlay(); 
    }
});


function addMute() {
    var i=0;
    $("#layerContainer div").each(function(){
        var button = document.createElement('button');
        button.innerText = "Mute";
        $(button).addClass("waves-effect waves-light btn-floating editButton");
        $(button).click(function(i){
            this.toggleMute();
            makeClearer(i,button);
        }.bind(waves[i],i));
        i++;
        $(this).append(button);
    });
}


function makeClearer(i,button){
    if (waveContainers[i*2].style.opacity == 1) {
        waveContainers[i*2].style.opacity = .2;
        button.style.opacity = .5;
    }
    else {waveContainers[i*2].style.opacity = 1;
            button.style.opacity = 1;
    }
}

function toggleInteract(){
    for (var i=0; i<waves.length; i++){
        waves[i].params.interact = !(waves[i].params.interact);
    }
}