window.onload = init;
var context;
var buffers =[];
var sourceList=[];
var isPlaying = false;
var startOffset = 0; //value of the trackbar used to control the audio's location

function init() {

	//Creates audio context for Web Audio API
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
  	context = new AudioContext();

  	//Loads songs and then calls finishedLoading()
	var bufferLoader = new BufferLoader(
		context,
	    [
	    	//Placeholder song for now
			"static/music/timshel.m4a",
	    ],
	    finishedLoading
	    );

	//calls the Song Loader
	bufferLoader.load();	
	//loads the countdown sound that happens when you hit record
	beepBuffer=loadBeep();
}

//Once songs are finished buffering sends buffered song data to
// buffers[] with inner arrays [song data, start Time] 
function finishedLoading(bufferList) {
	var startTime = 0; //sets startTime to 0 for now, once set up database will load startime
	
	for (var i=0;i<bufferList.length;i++) {
		buffers.push([bufferList[i],startTime]); 
	}

	//sets the trackbar maximum value to length of the solo track (song at index 0)
	var songLength = buffers[0][0].duration;
	$("#location").attr("max", songLength); 
}

//A play/pause button calls this 
var togglePlay = function() {
	if (isPlaying) {
		stopAll(sourceList);
	} 
	else {
		playAll(buffers);
	}
}

//goes through buffered audio data in buffers and plays all layers
function playAll(bufferList) {
	//clears volume sliders associated with old tracks, method defined in setViewVolume.js
	clearVolumeSlider(); 
	isPlaying = true;
  	
	//An important distinction in WebAudio API is between the audio buffer and the 
	//audio source node. The audio buffers have to be turned into audio sources 
	//each time before they are played. This loop manages that conversion.
  	sourceList=[];
		for (var i=0; i<bufferList.length;i++){
			var currentSource = context.createBufferSource();
			currentSource.buffer = bufferList[i][0];
			currentSource.layerStartTime = bufferList[i][1]; //what time the layer should start
			//Creates volume controls for each layer, this function defined in static/setViewVolume.js 
			setUpVolumeNodes(currentSource);
			sourceList[i]=currentSource;
		}
		
		//This loop plays the recordings at the correct time stamp
		for (var i=0; i<sourceList.length;i++){
			//if the layer is supposed to start later than the set play time,
			// delays the layer  
			if (sourceList[i].layerStartTime-startOffset>0){
				sourceList[i].start(context.currentTime+(sourceList[i].layerStartTime-startOffset));
			}
			//If the layers is supposed to start before or at the set play time,
			//jumps forward to the point in the layer that corresponds with start time
			else {
				sourceList[i].start(0,startOffset-sourceList[i].layerStartTime);
			}	
		}
	}

//stops all playing audio
function stopAll(sourceList){
	isPlaying = false;
	for (var i=0; i<sourceList.length;i++){
		sourceList[i].stop();
	}
}


//If the trackbar is moved, "seeks" to that location in audio by changing startOffset
$("#location[type=range]").change(function(){
		wasPlaying = isPlaying;
		stopAll(sourceList);
    	startOffset = $(this).val();
    	if (wasPlaying)	playAll(buffers);
 	 });


//Moves the trackbar forward in 1 second intervals when audio playing.
setInterval(function(){
	if (isPlaying) {
		document.getElementById("location").stepUp(1);
		startOffset=parseFloat(startOffset)+1;
	}
},1000);
