function createVolumeSlider(source) {
	var gainNode = context.createGain();
	gainNode.gain.value = 0.5;
	source.connect(gainNode);
	gainNode.connect(context.destination);

	var input = document.createElement("input");
	input.type = "range";
	input.min="0";
	input.max="4";
	input.step="0.05";
	input.className = "volumeSlider"; // set the CSS class
	
	$(input).change(function(){
		gainNode.gain.value = $(this).val();
		console.log(gainNode.gain.value);
	});

	$("#VolumeBox").append(input);
}




function createVisualization(source) {
	var analyser = context.createAnalyser();
	analyser.fftSize = 2048;
	var bufferLength = analyser.frequencyBinCount;
	var dataArray = new Uint8Array(bufferLength);
	canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);



}







function clearVolumeSlider() {
	$("#VolumeBox").empty();

}