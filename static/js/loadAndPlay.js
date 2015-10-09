	// Create Annonomuos Self Executing Function
window.onload = init;
var context;
var bufferLoader;
var buffers =[];
var sourceList=[];
var startedPlay;
var isPlaying = false;
var startOffset = 0;

function init() {
  // Fix up prefixing
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();

  bufferLoader = new BufferLoader(
    context,
    [
  //     "static/music/alto.wav",
		// "static/music/bari.wav",
		// "static/music/bass.wav",
		// "static/music/mezz.wav",
		// "static/music/sop.wav",
		// "static/music/ten.wav",
		"static/music/timshel.m4a",
    ],
    finishedLoading
    );

  bufferLoader.load();
  beepBuffer=loadBeep();
}


//sends buffered list to global variable for easy access
function finishedLoading(bufferList) {
	for (var i=0;i<bufferList.length;i++) {
		buffers.push([bufferList[i],0]);
	}
  	//buffers = bufferList;
	var songLength = buffers[0][0].duration;
	console.log("maxLength: "+songLength);
	$("#location").attr("max", songLength); //sets trackbar's max length at song end
  }


var startNow = function(){playAll(buffers);}
var stopNow = function(){stopAll(sourceList);}

var togglePlay = function() {
	if (isPlaying) {
		stopNow();
	} 
	else {
		startNow();
	}
}


var playAll = function(bufferList) {
	clearVolumeSlider();
	isPlaying = true;
	startedPlay = context.currentTime;
  	sourceList=[];
		for (var i=0; i<bufferList.length;i++){
			var currentSource = context.createBufferSource();
			currentSource.buffer = bufferList[i][0];
			currentSource.startLayer = bufferList[i][1]; //what Time the layer should start
			//currentSource.connect(context.destination); 
			createVolumeSlider(currentSource);
			sourceList[i]=currentSource;
		}
		
		for (var i=0; i<sourceList.length;i++){

			//manages starting added recordings at correct time stamp

			//if the layer is supposed to start later than the set play time,
			// delays the layer  
			if (sourceList[i].startLayer-startOffset>0){
				sourceList[i].start(context.currentTime+(sourceList[i].startLayer-startOffset));
			}
			//If the layers is supposed to start before or at the set play time,
			//jumps forward to the point in the layer that corresponds with start time
			else {
				sourceList[i].start(0,startOffset-sourceList[i].startLayer);
			}
			
		}
	}

var stopAll = function(sourceList){
	isPlaying = false;
		for (var i=0; i<sourceList.length;i++){
			sourceList[i].stop();
	}
}


$("#location[type=range]").change(function(){
		wasPlaying = isPlaying;
		stopNow();
    	startOffset = $(this).val();
    	if (wasPlaying)	startNow();
 	 });


setInterval(function(){
	if (isPlaying) {
		document.getElementById("location").stepUp(1);
		startOffset=parseFloat(startOffset)+1;
	}
},1000);
