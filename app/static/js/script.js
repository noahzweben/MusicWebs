var context;
var waves = [];
var waveContainers = [];
var timeOuts = [];
var maxDuration = 0;
var myTime =0;
var waveDiv = document.getElementById('wave');
var isPlaying = false;


var startTimes =[];
var sourcePaths=[];

// Init & load audio file


document.addEventListener('DOMContentLoaded', loadWaves);



function loadWaves() {

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();


    sourcePaths = grabListData(".path", false );
    startTimes = grabListData(".startTime", true);

    for (var i=0;i<sourcePaths.length;i++) {
        loadWave(sourcePaths[i],startTimes[i]); 
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
        cursorColor   : 'white',
        cursorWidth   : 1.5,
        height        : 100, 
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
    waveDiv.appendChild(div);
    waveContainers.push(div);
    return div;
}


function playAll(playTime) {
    restartAll();
    isPlaying = true;
    for (var i=0; i<waves.length; i++){

        //skip ahead, because playTime is above startTime
        if (playTime >= waves[i].startTime) {
            var beginAt = playTime-waves[i].startTime;
            if (beginAt < waves[i].getDuration()) waves[i].play(beginAt);
        }

        else {
            var delay = (waves[i].startTime-playTime)*1000;
            timeOuts.push(window.setTimeout(function() {
                this.play();
            }.bind(waves[i]),
            delay));
        }
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
            console.log(pauseTime);
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
        //console.log(i);
        // console.log(waves[i/2].startTime);
        // console.log(maxDuration);
        // console.log("here we g0 " + waves[i/2].startTime/maxDuration )
        waveContainers[i].style.width = waves[i/2].getDuration()/maxDuration*100+"%"
        waveContainers[i].style.marginLeft =  waves[i/2].startTime/maxDuration*100 +"%";
    }
}

function setMaxDuration() {
    for (var i =0;i<waves.length;i++) {
        // console.log(maxDuration);
        // console.log(waves[i].getDuration());
        maxDuration = Math.max(maxDuration,waves[i].getDuration());
    }
}

function setSeek() {
    for (var i =0;i<waves.length;i++) {
        waves[i].on('allSeek',function (percentage) {
            console.log("mememe "+this.startTime);
            myTime = percentage*(this.getDuration())+this.startTime;
            console.log("play at: "+myTime);
            var wasPlaying = isPlaying;
            console.log(wasPlaying);
            playAll(myTime);
        }.bind(waves[i]));
    }
}


$(document).keypress(function(e) {
    if(e.which == 32) {
      togglePlay(); 
    }
});






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
    if (!isPlaying) playAll(myTime);
        else pauseAll()
}


