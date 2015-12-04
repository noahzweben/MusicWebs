var beepBuffer;

var loadBeep = function() {	
 // Create the Sound 
	var getSound = new XMLHttpRequest(); // Load the Sound with XMLHttpRequest
	getSound.open("GET", "/static/music/stock/chime.wav", true); // Path to Audio File
	getSound.responseType = "arraybuffer"; // Read as Binary Data
	getSound.onload = function() {
		context.decodeAudioData(getSound.response, function(buffer){
			beepBuffer = buffer; // Decode the Audio Data and Store it in a Variable
		});
	}
	getSound.send(); // Send the Request and Load the File

}

var playCountdown = function() {
	for (var i =0;i<3;i++) {
		var playSound = context.createBufferSource(); // Declare a New Sound
		playSound.buffer = beepBuffer; // Attatch our Audio Data as it's Buffer
		playSound.connect(context.destination);  // Link the Sound to the Output
		playSound.start(context.currentTime+i); // Play the Sound Immediately
}
}