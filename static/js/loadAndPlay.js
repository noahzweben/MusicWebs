	// Create Annonomuos Self Executing Function
window.onload = init;
var context;
var bufferLoader;
var buffers =[];
var sourceList=[];

var startOffset = 0;
var startTime = 0;

function init() {
  // Fix up prefixing
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();

  bufferLoader = new BufferLoader(
    context,
    [
      "static/music/alto.wav",
		"static/music/bari.wav",
		"static/music/bass.wav",
		"static/music/mezz.wav",
		"static/music/sop.wav",
		"static/music/ten.wav",
    ],
    finishedLoading
    );

  bufferLoader.load();
  beepBuffer=loadBeep();
}


//sends buffered list to global variable for easy access
function finishedLoading(bufferList) {
  // Create two sources and play them both together.
  	buffers = bufferList;
	var songLength = buffers[0].duration;
	console.log("maxLength: "+songLength);
	$("#location").attr("max", songLength);
  }


var startNow = function(){playAll(buffers);}
var stopNow = function(){stopAll(sourceList);}


var playAll = function(bufferList) {
  	sourceList=[];
		for (var i=0; i<bufferList.length;i++){
			var currentSource = context.createBufferSource();
			console.log(i);
			currentSource.buffer = bufferList[i];
			currentSource.connect(context.destination); 
			sourceList[i]=currentSource;
		}
		for (var i=0; i<sourceList.length;i++){ 
			sourceList[i].start(0,startOffset);
		}
	}

var stopAll = function(sourceList){
	if (sourceList.length != 0) {
	for (var i=0; i<sourceList.length;i++){
		sourceList[i].stop();
	}
	}
}


$("[type=range]").change(function(){
    	startOffset = $(this).val();
    	console.log(startOffset);
 	 });